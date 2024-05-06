//* LIB
const amqp = require("amqplib");

//* REQUIRED
const config = require("./src/config");

const createConsumer = async () => {
  try {
    const connection = await amqp.connect(config.rabbitMQ.url);
    const channel = await connection.createChannel();

    const queue = config.rabbitMQ.queues.helloClassQueue;

    await channel.assertQueue(queue, {
      durable: false,
    });

    //* Handle message received
    channel.consume(
      queue,
      (msg) => {
        if (msg.content) {
          console.log(
            ` [x] Received message with queue "${queue}":`,
            msg.content.toString()
          );
        }
      },
      { noAck: true }
    );
  } catch (error) {
    console.error("Error:", error);
  }
};

createConsumer();
