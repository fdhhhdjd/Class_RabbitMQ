const amqp = require("amqplib");

const PriorityProducer = async () => {
  const connection = await amqp.connect("amqp://taiheo:taiheodev@localhost");
  const channel = await connection.createChannel();

  const queueDXL = "priority_queue";

  await channel.assertQueue("priority_queue", {
    durable: true,
    arguments: { "x-max-priority": 10 },
  });

  channel.sendToQueue(queueDXL, Buffer.from("Normal ticket"), {
    priority: 1,
    persistent: true,
  });
  channel.sendToQueue(queueDXL, Buffer.from("VIP ticket"), {
    priority: 10,
    persistent: true,
  });
  channel.sendToQueue(queueDXL, Buffer.from("Medium ticket"), {
    priority: 5,
    persistent: true,
  });

  console.log(" [x] Sent tickets with priorities.");
  await channel.close();
  await connection.close();
};

PriorityProducer().catch(console.error);
