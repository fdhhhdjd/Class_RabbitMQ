//* LIB
const amqp = require("amqplib");

//* REQUIRED
const config = require("../config");
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
    try {
      this.connection = await amqp.connect(config.rabbitMQ.url);

      this.producerChannel = await this.connection.createChannel();

      const { queue: replyQueueName } = await this.producerChannel.assertQueue(
        // Auto for rabbitMQ set name
        "",
        // Only connect a times, if connection this close it will delete queues
        { exclusive: false }
      );

      this.producer = new Producer(this.producerChannel, replyQueueName);

      console.log(`RabbitMQ Ready 🐇!!!`);

      this.isInitialized = true;
    } catch (error) {
      console.log("rabbitmq error...", error);
    }
  }

  async produce(data) {
    await this.initialize();
    return await this.producer.produceMessages(data);
  }
}

module.exports = RabbitMQClient.getInstance();
