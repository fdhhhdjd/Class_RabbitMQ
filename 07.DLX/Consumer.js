//* LIB
const amqp = require("amqplib");

//* REQUIRED
const config = require("./src/config");

const connectToRabbitMQ = async () => {
  const connection = await amqp.connect(config.rabbitMQ.url);
  const channel = await connection.createChannel();
  return { channel };
};

const createConsumer = async () => {
  try {
    const { channel } = await connectToRabbitMQ();
    //* Handle message Received
    channel.consume(config.rabbitMQ.notificationQueue, (msg) => {
      try {
        if (msg.content) {
          const numberTest = Math.random();
          console.info({ numberTest });

          if (numberTest < 0.8) {
            throw new Error("Send notification failed: Hot Fix");
          }

          console.info(`Send notification Success:::`, msg.content.toString());
          channel.ack(msg);
        }
      } catch (error) {
        console.error("Error DXL:", error);
        /*
          Pram 1 -> nack: Negative acknowledgement ( Xác nhận tiêu cực)
          Pram 2 -> false: Không được đẩy vào hàng đợi ban đầu nữa, mà đẩy xuống.
          Pram 3 -> false: Chỉ tin nhắn hiện tại được từ chối mà thôi
        */
        channel.nack(msg, false, false);
      }
    });
  } catch (error) {
    console.error("Error:", error);
  }
};

createConsumer();
