//* LIB
const amqp = require("amqplib");

//* REQUIRED
const config = require("./src/config");

const createConsumer1 = async (queueName) => {
  try {
    const connection = await amqp.connect(config.rabbitMQ.url);
    const channel = await connection.createChannel();
    const exchange = config.rabbitMQ.exchange;

    //* Variable exchange kind topic
    await channel.assertExchange(exchange, "topic", { durable: false });

    //* Variable queue unique for consumer
    const { queue } = await channel.assertQueue(queueName, { exclusive: true });

    //* Link queue with exchange with topic pattern "*.NodeJs.*"
    await channel.bindQueue(queue, exchange, "*.NodeJs.*");
    console.log(
      ` [*] Waiting for messages in ${queue} with topic pattern "*.NodeJs.*". To exit press CTRL+C`
    );

    //* Handle message Received
    channel.consume(
      queue,
      (msg) => {
        if (msg.content) {
          console.log(
            ` [x] Received message with topic pattern "*.NodeJs.*":`,
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

//* Create consumer receive message với topic pattern "*.NodeJs.*"
createConsumer1("consumer1Queue");
