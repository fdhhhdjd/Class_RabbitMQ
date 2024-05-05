const amqp = require("amqplib");
const config = require("./src/config");

async function createSubscriber(queueName, logType) {
  try {
    const connection = await amqp.connect(config.rabbitMQ.url);
    const channel = await connection.createChannel();
    const exchange = config.rabbitMQ.exchange;

    //* Variable exchange kind fanout
    await channel.assertExchange(exchange, "fanout", { durable: false });

    //* Variable queue unique for subscriber
    const { queue } = await channel.assertQueue(queueName, { exclusive: true });

    console.log(queue);

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
}

createSubscriber("infoLogs", "info");
// createSubscriber("warningLogs", "warning");
// createSubscriber("errorLogs", "error");
