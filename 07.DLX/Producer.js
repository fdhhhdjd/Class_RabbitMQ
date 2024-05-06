//* LIB
const amqp = require("amqplib");

//* REQUIRED
const config = require("./src/config");

const Producer = async () => {
  try {
    const connection = await amqp.connect(config.rabbitMQ.url);
    const channel = await connection.createChannel();

    const notificationExchange = config.rabbitMQ.notificationExchange; // notification direct (3);
    const notificationQueue = config.rabbitMQ.notificationQueue; // assert Queue (4)
    const notificationExchangeDLX = config.rabbitMQ.notificationExchangeDLX; // notification direct
    const notificationRoutingKeyDLX = config.rabbitMQ.notificationRoutingKeyDLX; // notification assert

    await channel.assertExchange(notificationExchange, "direct", {
      durable: true,
    });

    // 2 Create Queue
    const queueResult = await channel.assertQueue(notificationQueue, {
      exclusive: false, // accept all connection concurrency access to queue
      deadLetterExchange: notificationExchangeDLX, // (1)
      deadLetterRoutingKey: notificationRoutingKeyDLX, // (2)
    });

    // 3. Bind Queue
    await channel.bindQueue(queueResult.queue, notificationExchange);

    // 4. Send message
    const msg = "A new product";

    console.log(`Producer msg::`, msg);

    const messageBuffer = Buffer.from(msg);
    const _3_SECONDS = 3000;
    await channel.sendToQueue(queueResult.queue, messageBuffer, {
      expiration: _3_SECONDS, // ttl 10s
    });

    await channel.close();
    await connection.close();
  } catch (error) {
    console.error("Error:", error);
  }
};

Producer();
