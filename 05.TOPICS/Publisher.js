//* LIB
const amqp = require("amqplib");

//* REQUIRED
const config = require("./src/config");

const publishMessage = async (topicKey, message) => {
  try {
    const connection = await amqp.connect(config.rabbitMQ.url);
    const channel = await connection.createChannel();
    const exchange = config.rabbitMQ.exchange;

    //* Variable exchange kind direct
    await channel.assertExchange(exchange, "topic", { durable: false });

    //* Publish message with topic specifically
    await channel.publish(exchange, topicKey, Buffer.from(message));

    console.log(` [x] Sent message with topic key "${topicKey}": ${message}`);

    await channel.close();
    await connection.close();
  } catch (error) {
    console.error("Error:", error);
  }
};

// Send message with topic key "logs.NodeJs.info"
publishMessage("topic.NodeJs.info", "This is NodeJs");

// Send message with topic key "logs.Go.error"
publishMessage("*.*.Go", "This is GO");

//Send message with topic key "Python.anything.you.want"
publishMessage("Python.anything.you.want", "This is PYTHON");
