//* LIB
const amqp = require("amqplib");

//* REQUIRED
const config = require("./src/config");

const createConsumer2 = async (queueName) => {
  try {
    const connection = await amqp.connect(config.rabbitMQ.url);
    const channel = await connection.createChannel();
    const exchange = config.rabbitMQ.exchange;

    await channel.assertExchange(exchange, "topic", { durable: false });

    const { queue } = await channel.assertQueue(queueName, {
      exclusive: false,
    });

    await channel.bindQueue(queue, exchange, "*.*.Go");
    await channel.bindQueue(queue, exchange, "Python.#");
    console.log(
      ` [*] Waiting for messages in ${queue} with topic patterns "*.*.Go", and "Python.#". To exit press CTRL+C`
    );

    //* Handle message Received
    channel.consume(
      queue,
      (msg) => {
        if (msg.content) {
          console.log(` [x] Received message:`, msg.content.toString());
        }
      },
      { noAck: true }
    );
  } catch (error) {
    console.error("Error:", error);
  }
};

createConsumer2("consumer2Queue");
