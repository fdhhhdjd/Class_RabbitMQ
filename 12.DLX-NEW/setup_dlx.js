const amqp = require("amqplib");

const DXL = async () => {
  const connection = await amqp.connect("amqp://taiheo:taiheodev@localhost");
  const channel = await connection.createChannel();

  // DLX
  const queueDXL = "dead_letter_queue";
  const ExchangeDXL = "dlx_exchange";
  await channel.assertExchange(ExchangeDXL, "fanout", { durable: true });
  await channel.assertQueue(queueDXL, { durable: true });
  await channel.bindQueue(queueDXL, ExchangeDXL, "");

  // Queue chính có DLX & TTL: msg hết hạn sẽ sang DLX
  const queueMain = "main_queue";

  await channel.assertQueue(queueMain, {
    durable: true,
    arguments: {
      "x-dead-letter-exchange": ExchangeDXL,
      "x-message-ttl": 5000,
    },
  });

  // Gửi demo
  for (let i = 1; i <= 10; i++) {
    const msg = `Task ${i}`;
    channel.sendToQueue(
      queueMain,
      Buffer.from("This may expire or be rejected"),
      { persistent: true }
    );
    console.log(" [x] Sent:", msg);
  }

  await channel.close();
  await connection.close();
};

DXL().catch(console.error);
