const amqp = require("amqplib");

const producer = async () => {
  const connection = await amqp.connect("amqp://taiheo:taiheodev@localhost");
  const channel = await connection.createChannel();

  const queue = "task_queue";
  await channel.assertQueue(queue, { durable: true });

  // Gửi 10 task demo
  for (let i = 1; i <= 10; i++) {
    const msg = `Task ${i}`;
    channel.sendToQueue(queue, Buffer.from(msg), { persistent: true }); // Message bền vững
    console.log(" [x] Sent:", msg);
  }
  await channel.close();
  await connection.close();
};

producer().catch(console.error);
