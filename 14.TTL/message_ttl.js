const amqp = require("amqplib");

const messageTTL = async () => {
  const connection = await amqp.connect("amqp://taiheo:taiheodev@localhost");
  const channel = await connection.createChannel();
  const queue = "msg_ttl_queue";

  await channel.assertQueue(queue, { durable: true });

  channel.sendToQueue(queue, Buffer.from("OTP: 654321"), {
    persistent: true,
    expiration: "5000", // 5s
  });
  console.log(" [x] Sent OTP with message TTL (5s).");

  await channel.close();
  await connection.close();
};

messageTTL().catch(console.error);
