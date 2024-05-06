//* LIB
const amqp = require("amqplib");

//* REQUIRED
const config = require("./src/config");

const publishMessage = async (routingKey, message) => {
  try {
    const connection = await amqp.connect(config.rabbitMQ.url);
    const channel = await connection.createChannel();
    const exchange = config.rabbitMQ.exchange;

    //* Variable exchange kind direct
    await channel.assertExchange(exchange, "direct", { durable: false });

    //* Publish message with routing key specifically
    await channel.publish(exchange, routingKey, Buffer.from(message));
    console.log(
      ` [x] Sent message with routing key "${routingKey}": ${message}`
    );

    await channel.close();
    await connection.close();
  } catch (error) {
    console.error("Error:", error);
  }
};

//* Send message with routing key "info"
publishMessage("NodeJs", "This is NodeJs");

//* Send message with routing ke "warning"
publishMessage("GO", "This is GO");

//* Send message with routing ke "error"
publishMessage("Python", "This is Python");
