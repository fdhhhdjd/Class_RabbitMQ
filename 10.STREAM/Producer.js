const amqp = require("amqplib");
const config = require("./src/config");

async function produceMessages() {
  try {
    const connection = await amqp.connect(config.rabbitMQ.url);
    const channel = await connection.createConfirmChannel();

    await channel.assertQueue(config.rabbitMQ.queue.name, {
      arguments: { "x-queue-type": "stream" },
    });

    for (let i = 0; i <= 100; i++) {
      const message = `Message ${i}`;
      await channel.sendToQueue(
        config.rabbitMQ.queue.name,
        Buffer.from(message),
        {},
        (err, ok) => {
          if (err) {
            console.error("Message nacked", err);
          } else {
            console.log(`Sent: ${message}`);
          }
        }
      );
    }

    await channel.waitForConfirms();
    await connection.close();
  } catch (error) {
    console.error("Error producing messages:", error);
  }
}

produceMessages();
