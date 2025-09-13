//* LIB
const amqp = require("amqplib");

//* REQUIRED
const config = require("./src/config");

const createConsumer = async () => {
  try {
    const connection = await amqp.connect(config.rabbitMQ.url);
    const channel = await connection.createChannel();

    //* Variable queue uniques for consumer
    const { queue } = await channel.assertQueue(
      config.rabbitMQ.queues.workQueues,
      { exclusive: false, durable: true }
    );

    //* Handle message received
    channel.consume(
      queue,
      (msg) => {
        if (msg.content) {
          console.log(
            ` [x] Received message with queue "${config.rabbitMQ.queues.workQueues}":`,
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
