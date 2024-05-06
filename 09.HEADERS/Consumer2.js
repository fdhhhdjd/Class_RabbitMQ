//* LIB
const amqp = require("amqplib");

//* REQUIRED
const config = require("./src/config");

const consumer2 = async () => {
  try {
    const connection = await amqp.connect(config.rabbitMQ.url);
    const channel = await connection.createChannel();

    const exchange = config.rabbitMQ.exchange;
    const queueName = config.rabbitMQ.queue2;
    await channel.assertExchange(exchange, "headers", { durable: true });
    await channel.assertQueue(queueName, { durable: true });

    const bindingHeaders = {
      male: "Tai",
    };
    await channel.bindQueue(queueName, exchange, "", bindingHeaders);

    console.log(`Waiting for messages in ${queueName}`);

    channel.consume(queueName, (msg) => {
      const message = msg.content.toString();
      console.log(
        "Received message:",
        message,
        "----",
        "Headers:",
        msg.properties.headers
      );
      channel.ack(msg);
    });
  } catch (error) {
    console.error("Error:", error);
  }
};

consumer2();
