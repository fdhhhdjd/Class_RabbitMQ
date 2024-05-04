class Consumer {
  constructor(channel, rpcQueue) {
    this.channel = channel;
    this.rpcQueue = rpcQueue;
  }

  async consumeMessages() {
    console.log("Ready to consume messages...");

    this.channel.consume(
      this.rpcQueue,
      async (message) => {
        const { correlationId, replyTo } = message.properties;
        if (!correlationId || !replyTo) {
          console.log("Missing some properties...");
        }
        console.log("Consumed", JSON.parse(message.content.toString()));
      },
      {
        noAck: true,
      }
    );
  }
}

module.exports = Consumer;
