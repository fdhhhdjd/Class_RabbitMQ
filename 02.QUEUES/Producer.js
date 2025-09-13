//* LIB
const amqp = require("amqplib");

//* REQUIRED
const config = require("./src/config");

const ProducerMessage = async (message) => {
  try {
    const connection = await amqp.connect(config.rabbitMQ.url);
    const channel = await connection.createChannel();

    await channel.assertQueue(
      //* Auto for rabbitMQ set name
      "",
      {
        //* Access for many consumers connection
        exclusive: false,

        //* Save queue at disk
        durable: true,
      }
    );

    //* Publish message with routing key specifically
    channel.sendToQueue(
      config.rabbitMQ.queues.workQueues,
      Buffer.from(JSON.stringify(message))
    );

    console.log(`RabbitMQ Ready 🐇!!!`);

    console.log(
      ` [x] Sent message with queue "${config.rabbitMQ.queues.workQueues}": ${message}`
    );

    await channel.close();
    await connection.close();
  } catch (error) {
    console.error("Error:", error);
  }
};

//* Send message
ProducerMessage("I'm Nguyen Tien Tai");
