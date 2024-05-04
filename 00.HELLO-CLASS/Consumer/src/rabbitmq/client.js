//* LIB
const { connect } = require("amqplib");

//* REQUIRE
const config = require("../config");
const Consumer = require("./consumer");

class RabbitMQClient {
  constructor() {
    this.isInitialized = false;
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new RabbitMQClient();
    }
    return this.instance;
  }

  async initialize() {
    try {
      this.connection = await connect(config.rabbitMQ.url);

      this.consumerChannel = await this.connection.createChannel();

      const { queue: rpcQueue } = await this.consumerChannel.assertQueue(
        config.rabbitMQ.queues.helloClassQueue,
        { exclusive: true, durable: true }
      );

      this.consumer = new Consumer(this.consumerChannel, rpcQueue);
      this.consumer.consumeMessages();

      this.isInitialized = true;
    } catch (error) {
      console.log("rabbitMQ error...", error);
    }
  }
}

module.exports = RabbitMQClient.getInstance();
