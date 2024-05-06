//* LIB
const amqp = require("amqplib");

//* REQUIRED
const config = require("./src/config");

const Producer = async () => {
  try {
    const connection = await amqp.connect(config.rabbitMQ.url);
    const channel = await connection.createChannel();

    const queueName = config.rabbitMQ.queue;
    await channel.assertQueue(queueName, { durable: true });

    for (let i = 0; i < 8; i++) {
      const message = `Message ${i}`;
      console.log(`Sending message: ${message}`);
      channel.sendToQueue(queueName, Buffer.from(message), {
        persistent: true,
      });
    }

    await channel.close();
    await connection.close();
  } catch (error) {
    console.log(error);
  }
};

Producer();
