class Consumer {
  constructor(channel, replyQueueName, eventEmitter) {
    this.channel = channel;
    this.replyQueueName = replyQueueName;
    this.eventEmitter = eventEmitter;
  }

  async consumeMessages() {
    console.log("Ready to consume messages...");

    this.channel.consume(
      this.replyQueueName,
      (message) => {
        console.log("the reply is..", JSON.parse(message.content.toString()));

        this.eventEmitter.emit(
          message.properties.correlationId.toString(),
          message.content.toString()
        );
      },
      {
        noAck: true,
      }
    );
  }
}

module.exports = Consumer;
