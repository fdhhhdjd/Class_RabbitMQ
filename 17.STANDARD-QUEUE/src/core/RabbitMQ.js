const amqp = require('amqplib');
const configs = require('../configs/rabbit.config')

class RabbitMQ {
    constructor() {
        this.connection = null;
        this.channel = null
    }

    async connect() {
        if(!this.connection) {
            try {
                this.connection = await amqp.connect(configs.RABBITMQ_URL);
                this.channel = await this.connection.createChannel();  
                console.log("✅ RabbitMQ connected");
            } catch (error) {
                console.error("❌ Failed to connect to RabbitMQ:", error.message);
                throw error; 
            }
        }
        return this.channel
    }

    // ----------------------------
    // 1. Normal Queue (không qua exchange)
    // ----------------------------

    async sendToQueue(queueName, message) {
        const channel = await this.connect();
        await channel.assertQueue(queueName, { durable: true });
        channel.sendToQueue(queueName, Buffer.from(message));
        console.log(`📤 Sent to queue [${queueName}] -> ${message}`);
    }
    
    async consumeQueue(queueName, callback) {
        const channel = await this.connect();
        await channel.assertQueue(queueName, { durable: true });
        channel.consume(queueName, (msg) => {
          if (msg !== null) {
            callback(msg.content.toString());
            channel.ack(msg);
          }
        });
        console.log(`👂 Listening queue [${queueName}]`);
    }
 
    // ----------------------------
    // 2. Exchange Mode
    // ----------------------------
    async publish(exchange, type, routingKey, message) {
        const channel = await this.connect();
        await channel.assertExchange(exchange, type, { durable: true });
        channel.publish(exchange, routingKey, Buffer.from(message));
        console.log(`📤 Published to [${exchange}] type=${type} key=${routingKey} -> ${message}`);
    }

    async subscribe(exchange, type, bindingKey, callback) {
        const channel = await this.connect();
        await channel.assertExchange(exchange, type, { durable: true });
    
        const q = await channel.assertQueue("", { exclusive: true }); // auto queue
        await channel.bindQueue(q.queue, exchange, bindingKey);
    
        channel.consume(q.queue, (msg) => {
          if (msg !== null) {
            callback(msg.content.toString());
            channel.ack(msg);
          }
        });
        console.log(`👂 Subscribed [${exchange}] type=${type} bindingKey=${bindingKey}`);
    }
}

module.exports = new RabbitMQ()