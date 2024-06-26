//* LIB
const amqp = require("amqplib");

//* REQUIRED
const config = require("./src/config");

const createSubscriber = async (queueName, logType) => {
  try {
    const connection = await amqp.connect(config.rabbitMQ.url);
    const channel = await connection.createChannel();
    const exchange = config.rabbitMQ.exchange;

    //* Variable exchange kind fanout
    await channel.assertExchange(exchange, "fanout", { durable: false });

    //* Variable queue unique for subscriber
    const { queue } = await channel.assertQueue(queueName, { exclusive: true });

    //* Link queue with exchange
    await channel.bindQueue(queue, exchange, "");

    console.log(
      ` [*] Waiting for ${logType} logs in ${queue}. To exit press CTRL+C`
    );

    // * Handle message did received
    channel.consume(
      queue,
      (msg) => {
        if (msg.content) {
          console.log(` [x] Received ${logType} log:`, msg.content.toString());
        }
      },
      { noAck: true }
    );
  } catch (error) {
    console.error("Error:", error);
  }
};

createSubscriber("infoLogs", "info");
// createSubscriber("warningLogs", "warning");
// createSubscriber("errorLogs", "error");
