//* LIB
const amqp = require("amqplib");

//* REQUIRED
const config = require("./src/config");

const createConsumer = async (queueName) => {
  try {
    const connection = await amqp.connect(config.rabbitMQ.url);
    const channel = await connection.createChannel();
    const exchange = config.rabbitMQ.exchange;

    //* Variable exchange kind direct
    await channel.assertExchange(exchange, "direct", { durable: false });

    //* Variable queue uniques for consumer
    const { queue } = await channel.assertQueue(queueName, { exclusive: true });

    //* Link queues with exchange all routing keys
    await channel.bindQueue(queue, exchange, "NodeJs");
    await channel.bindQueue(queue, exchange, "GO");
    await channel.bindQueue(queue, exchange, "Python");
    console.log(` [*] Waiting for messages in ${queue}. To exit press CTRL+C`);

    //* Handle message did receive
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

// Tạo consumer nhận message với tất cả các routing key
createConsumer("allMessagesQueue");
