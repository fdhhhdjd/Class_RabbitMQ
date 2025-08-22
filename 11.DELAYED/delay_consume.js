const amqp = require("amqplib");

const delayConsumers = async () => {
  const connection = await amqp.connect("amqp://admin:admin123@localhost");
  const channel = await connection.createChannel();

  const queueDelay = "delayed_target_queue";
  await channel.assertQueue(queueDelay, { durable: true });

  console.log("[*] Waiting for delayed messages...");

  channel.consume(queueDelay, (msg) => {
    console.log(
      " [✓] Delayed received:",
      msg.content.toString(),
      "at",
      new Date().toISOString()
    );
    channel.ack(msg);
  });
};

delayConsumers().catch(console.error);
