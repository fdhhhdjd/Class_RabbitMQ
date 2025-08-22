const amqp = require("amqplib");

const queueTTL = async () => {
  const connection = await amqp.connect("amqp://taiheo:taiheodev@localhost");
  const channel = await connection.createChannel();
  const queue = "queue_with_ttl";

  await channel.assertQueue(queue, {
    durable: true,
    arguments: { "x-message-ttl": 10000 }, // 10s
  });

  channel.sendToQueue("queue_with_ttl", Buffer.from("OTP: 123456"), {
    persistent: true,
  });
  console.log(" [x] Sent OTP with queue TTL (10s).");

  await channel.close();
  await connection.close();
};

queueTTL().catch(console.error);
