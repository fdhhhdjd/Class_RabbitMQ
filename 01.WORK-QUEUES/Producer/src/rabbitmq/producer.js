//* LIB
const { randomUUID } = require("crypto");
const config = require("../config");

class Producer {
  constructor(channel, replyQueueName) {
    this.channel = channel;
    this.replyQueueName = replyQueueName;
  }

  async produceMessages(data) {
    console.log("Send Queue::", config.rabbitMQ.queues.workQueues);
    this.channel.sendToQueue(
      config.rabbitMQ.queues.workQueues,
      Buffer.from(JSON.stringify(data))
    );
    return config.rabbitMQ.queues.workQueues;
  }
}

module.exports = Producer;
