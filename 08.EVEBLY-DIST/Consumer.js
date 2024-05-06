//* LIB
const amqp = require("amqplib");

//* REQUIRED
const config = require("./src/config");

const consumer = async () => {
  try {
    const connection = await amqp.connect(config.rabbitMQ.url);
    const channel = await connection.createChannel();

    const queueName = config.rabbitMQ.queue;
    await channel.assertQueue(queueName, { durable: true });

    //* Only get 1 message to handle
    channel.prefetch(1);
    console.log(`Waiting for messages in ${queueName}`);

    channel.consume(queueName, (msg) => {
      const message = msg.content.toString();
      console.log("Received message:", message);
      setTimeout(() => {
        console.log("processed", message);
        channel.ack(msg);
      }, Math.random() * 1000);
    });
  } catch (error) {
    console.error("Error:", error);
  }
};

consumer();
