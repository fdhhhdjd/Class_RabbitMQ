const RabbitMQ = require("../core/RabbitMQ")

const Producers = async () => {
    // 1. Normal Queue
    // const queueName = 'email.send.v1.dev'
    // const messageQueue = 'Hello everybody'
    // await RabbitMQ.sendToQueue(queueName, messageQueue)

    // // 2. Fanout
    // const exchangeFanout = 'order.commands.v1'
    // const messageFanout = 'Hello everybody Fanout'
    // await RabbitMQ.publish(exchangeFanout,"fanout","", messageFanout)

    // 3. Direct
    // const exchangeDirect = 'email.events.v1'
    // await RabbitMQ.publish(exchangeDirect, "direct", "info", "Hello direct info");
    // await RabbitMQ.publish(exchangeDirect, "direct", "error", "Hello direct error");

    // 4. Topic
    const exchangeTopic= 'email.topics.v1'
    await RabbitMQ.publish(exchangeTopic, "topic", "user.created", "Hello topic user.created");
    await RabbitMQ.publish(exchangeTopic, "topic", "order.completed", "Hello topic order.completed");
    
}

Producers()
