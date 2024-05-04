const { connect } = require("amqplib");
const config = require("../config");
const Consumer = require("./consumer");
const Producer = require("./producer");

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
    if (this.isInitialized) {
      return;
    }

    try {
      this.connection = await connect(config.rabbitMQ.url);

      this.producerChannel = await this.connection.createChannel();
      this.consumerChannel = await this.connection.createChannel();

      const { queue: rpcQueue } = await this.consumerChannel.assertQueue(
        config.rabbitMQ.queues.rpcQueue,
        { exclusive: true }
      );

      this.producer = new Producer(this.producerChannel);
      if (this.producer) {
        this.consumer = new Consumer(
          this.consumerChannel,
          rpcQueue,
          this.producer
        );
        this.consumer.consumeMessages();
      }

      this.isInitialized = true;
    } catch (error) {
      console.log("rabbitMQ error...", error);
    }
  }
}

module.exports = RabbitMQClient.getInstance();
