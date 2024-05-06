//* LIB
const amqp = require("amqplib");

//* REQUIRED
const config = require("./src/config");

async function createConsumer(queueName, routingKey) {
  try {
    const connection = await amqp.connect(config.rabbitMQ.url);
    const channel = await connection.createChannel();
    const exchange = config.rabbitMQ.exchange;

    //* Variable exchange kind direct
    await channel.assertExchange(exchange, "direct", { durable: false });

    //* Variable queue uniques for consumer
    const { queue } = await channel.assertQueue(queueName, { exclusive: true });

    //* Link queue with exchange with routing key specified
    await channel.bindQueue(queue, exchange, routingKey);
    console.log(
      ` [*] Waiting for messages in ${queue} with routing key "${routingKey}". To exit press CTRL+C`
    );

    //* Handle message received
    channel.consume(
      queue,
      (msg) => {
        if (msg.content) {
          console.log(
            ` [x] Received message with routing key "${routingKey}":`,
            msg.content.toString()
          );
        }
      },
      { noAck: true }
    );
  } catch (error) {
    console.error("Error:", error);
  }
}

//* Create consumer received message with routing key "info"
createConsumer("infoQueue", "NodeJs");
