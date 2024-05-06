//* LIB
const amqp = require("amqplib");

//* REQUIRED
const config = require("./src/config");

const connectToRabbitMQ = async () => {
  const connection = await amqp.connect(config.rabbitMQ.url);
  const channel = await connection.createChannel();
  return { channel };
};

const consumerToQueueFail = async () => {
  try {
    const { channel } = await connectToRabbitMQ();
    const notificationExchangeDLX = config.rabbitMQ.notificationExDLX; // notification direct
    const notificationRoutingKeyDLX = config.rabbitMQ.notificationRoutingKeyDLX; // notification assert
    const notificationHandler = config.rabbitMQ.notificationHotFix;

    await channel.assertExchange(notificationExchangeDLX, "direct", {
      durable: true, // Availability
    });
    const queueResult = await channel.assertQueue(notificationHandler, {
      exclusive: false, // Only 1 connection handle
    });

    await channel.bindQueue(
      queueResult.name,
      notificationExchangeDLX,
      notificationRoutingKeyDLX
    );

    await channel.consume(
      queueResult.queue,
      (msgFailed) => {
        console.info(
          `This notification error Hotfix: `,
          msgFailed.content.toString()
        );
      },
      {
        noAck: true,
      }
    );
  } catch (error) {
    console.error(error);
    throw error;
  }
};

consumerToQueueFail();
