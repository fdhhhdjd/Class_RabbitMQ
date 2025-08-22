const amqp = require("amqplib");

const Worker = async () => {
  const connection = await amqp.connect("amqp://taiheo:taiheodev@localhost");
  const channel = await connection.createChannel();

  const queue = "task_queue";
  await channel.assertQueue(queue, { durable: true });

  channel.prefetch(1);

  console.log("[*] Waiting for tasks...");

  channel.consume(
    queue,
    async (msg) => {
      const task = msg.content.toString();
      console.log(" [x] Received:", task);
      // Giả lập xử lý 2s
      await new Promise((res) => setTimeout(res, 2000));
      console.log(" [✓] Done:", task);
      channel.ack(msg);
    },
    { noAck: false }
  );
};

Worker().catch(console.error);
