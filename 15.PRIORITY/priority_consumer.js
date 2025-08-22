const amqp = require("amqplib");

const PriorityConsumer = async () => {
  const connection = await amqp.connect("amqp://taiheo:taiheodev@localhost");
  const channel = await connection.createChannel();

  const queueDXL = "priority_queue";

  await channel.assertQueue(queueDXL, {
    durable: true,
    arguments: { "x-max-priority": 10 },
  });

  console.log("[*] Waiting priority tasks...");
  channel.consume("priority_queue", (msg) => {
    console.log(" [x] Got:", msg.content.toString());
    channel.ack(msg);
  });
  console.log("--------------");
};

PriorityConsumer().catch(console.error);
