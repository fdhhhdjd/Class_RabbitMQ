//* LIB
const amqp = require("amqplib");

//* REQUIRED
const config = require("./src/config");

const publishMessage = async () => {
  try {
    const connection = await amqp.connect(config.rabbitMQ.url);
    const channel = await connection.createChannel();

    const exchange = config.rabbitMQ.exchange;
    const routingKey = config.rabbitMQ.queue1;
    await channel.assertExchange(exchange, "headers", { durable: true });

    const headers = {
      male: "Tai",
    };
    const message = "Message with headers";
    const options = { headers };

    channel.publish(exchange, routingKey, Buffer.from(message), options);
    console.log(`Sent message: ${message}`);

    await channel.close();
    await connection.close();
  } catch (error) {
    console.error("Error:", error);
  }
};

publishMessage();
