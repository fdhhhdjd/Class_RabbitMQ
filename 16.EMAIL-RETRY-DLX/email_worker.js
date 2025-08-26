const amqp = require("amqplib");

function getRetryCount(msg) {
  // RabbitMQ thêm header x-death khi đi qua DLX/queue retry
  const death = msg.properties.headers && msg.properties.headers["x-death"];
  if (Array.isArray(death) && death.length > 0) {
    // Tổng số lần chết (cộng count của các lần)
    return death.reduce((sum, d) => sum + (d.count || 0), 0);
  }
  return 0;
}

function simulateSendEmail(job) {
  // Mô phỏng gửi email:
  // - 'always' => luôn fail
  // - 'never'  => luôn ok
  // - 'random' => 50/50
  if (job.shouldFail === "always") return false;
  if (job.shouldFail === "never") return true;
  return Math.random() < 0.5;
}

const EmailWorker = async () => {
  const connection = await amqp.connect("amqp://taiheo:taiheodev@localhost");
  const channel = await connection.createChannel();

  const ExchangeMain = "email.main.ex";
  const ExchangeRetry = "email.retry.ex";
  const ExchangeDead = "email.dead.ex";

  await channel.assertExchange(ExchangeMain, "direct", { durable: true });
  await channel.assertExchange(ExchangeRetry, "direct", { durable: true });
  await channel.assertExchange(ExchangeDead, "fanout", { durable: true });

  const queueMain = "email.main";
  const queueDead = "email.dead";

  const routingRetry = "retry";
  const routingMain = "email";

  await channel.assertQueue(queueMain, {
    durable: true,
    arguments: {
      "x-dead-letter-exchange": ExchangeRetry,
      "x-dead-letter-routing-key": routingRetry,
    },
  });

  // Main
  await channel.bindQueue(queueMain, ExchangeMain, routingMain);

  // Dead
  await channel.assertQueue(queueDead, { durable: true });
  await channel.bindQueue(queueDead, ExchangeDead, "");

  channel.prefetch(5);
  console.log("[*] Email worker started. Waiting for jobs...");

  channel.consume(
    queueMain,
    async (msg) => {
      const body = msg.content.toString();
      const job = JSON.parse(body);
      const retryCount = getRetryCount(msg);
      console.log(
        ` [>] Processing email to=${job.to}, subject=${job.subject}, retryCount=${retryCount}`
      );

      const ok = simulateSendEmail(job);

      if (ok) {
        console.log(` [✓] Sent email to ${job.to}`);
        channel.ack(msg);
        return;
      }
      // Không ok → kiểm tra số lần retry
      if (retryCount >= 3) {
        console.log(` [✗] Max retries reached for ${job.to}. Send to DEAD.`);
        // Đẩy sang dead exchange để lưu trữ/giám sát
        channel.publish(
          ExchangeDead,
          "",
          Buffer.from(
            JSON.stringify({
              ...job,
              failedAt: new Date().toISOString(),
              reason: "MaxRetry",
            })
          ),
          { persistent: true }
        );
        // Ack để kết thúc vòng đời message, tránh lặp
        channel.ack(msg);
      } else {
        console.log(` [!] Fail send to ${job.to}. Will retry via DLX in 10s.`);
        // Reject không requeue để kích hoạt DLX → sang email.retry → TTL 10s → quay lại email.main
        channel.reject(msg, false);
      }
    },
    { noAck: false }
  );
};

EmailWorker().catch(console.error);
