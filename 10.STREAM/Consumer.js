const amqp = require("amqplib");
const config = require("./src/config");
const fs = require("fs");
const offsetFilePath = "./offset.txt";
const dataWarehouseFilePath = "./dataWarehouse.txt";

// Save data warehouse
async function saveToDataWarehouse(message) {
  return new Promise((resolve, reject) => {
    fs.appendFile(dataWarehouseFilePath, message + "\n", (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

async function consumeMessages() {
  try {
    const connection = await amqp.connect(config.rabbitMQ.url);
    const channel = await connection.createChannel();

    await channel.assertQueue(config.rabbitMQ.queue.name, {
      arguments: { "x-queue-type": "stream" },
    });

    await channel.prefetch(1);

    let offset = fs.existsSync(offsetFilePath)
      ? parseInt(fs.readFileSync(offsetFilePath, "utf8"))
      : 0;
    console.log(`Starting from offset: ${offset}`);

    channel.consume(
      config.rabbitMQ.queue.name,
      async (msg) => {
        if (msg !== null) {
          try {
            const messageContent = msg.content.toString();
            console.log(`Received: ${messageContent}`);
            await saveToDataWarehouse(messageContent);
            offset = msg.fields.deliveryTag;
            fs.writeFileSync(offsetFilePath, offset.toString(), "utf8");
            channel.ack(msg);
          } catch (error) {
            console.error("Error processing message:", error);
          }
        }
      },
      {
        noAck: false,
      }
    );

    console.log("Waiting for messages.");
  } catch (error) {
    console.error("Error consuming messages:", error);
  }
}

consumeMessages();
