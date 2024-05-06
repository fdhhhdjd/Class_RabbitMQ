//* LIB
const amqp = require("amqplib");

//* REQUIRED
const config = require("./src/config");

const producerMessage = async (message) => {
  try {
    const connection = await amqp.connect(config.rabbitMQ.url);
    const channel = await connection.createChannel();

    const queue = config.rabbitMQ.queues.helloClassQueue;

    await channel.assertQueue(
      //* Queues
      queue,
      {
        //* Not need save disk if docker stop lost data
        durable: false,
      }
    );

    //* Send message
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));

    console.log(`RabbitMQ Ready 🐇!!!`);

    console.log(` [x] Sent message with queue "${queue}": ${message}`);

    await channel.close();
    await connection.close();
  } catch (error) {
    console.error("Error:", error);
  }
};

//* Send message
producerMessage("Hello Class Tai");
