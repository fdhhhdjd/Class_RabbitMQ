const amqp = require("amqplib");

const sendDelay = async () => {
  const connection = await amqp.connect("amqp://taiheo:taiheodev@localhost");
  const channel = await connection.createChannel();

  const queueDelay10s = "delay_queue_10s";

  channel.sendToQueue(queueDelay10s, Buffer.from("Send this after 10s"), {
    persistent: true,
  });

  console.log(" [x] Sent to delay_queue_10s (delayed 10s).");

  await channel.close();
  await connection.close();
};

sendDelay().catch(console.error);
