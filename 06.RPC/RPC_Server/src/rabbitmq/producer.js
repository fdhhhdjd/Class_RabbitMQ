class Producer {
  constructor(channel) {
    this.channel = channel;
  }

  async produceMessages(data, correlationId, replyToQueue) {
    console.log("Responding with..", data);
    this.channel.sendToQueue(
      replyToQueue,
      Buffer.from(JSON.stringify(data)),
      {
        correlationId: correlationId,
      }
    );
  }
}

module.exports = Producer;
