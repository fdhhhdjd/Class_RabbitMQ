//* LIB
const { randomUUID } = require("crypto");
const config = require("../config");

class Producer {
  constructor(channel, replyQueueName) {
    this.channel = channel;
    this.replyQueueName = replyQueueName;
  }

  async produceMessages(data) {
    console.log("Send Queue::", config.rabbitMQ.queues.helloClassQueue);
    this.channel.sendToQueue(
      config.rabbitMQ.queues.helloClassQueue,
      Buffer.from(JSON.stringify(data))
    );
    return config.rabbitMQ.queues.helloClassQueue;
  }
}

module.exports = Producer;
