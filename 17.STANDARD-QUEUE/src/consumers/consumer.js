const RabbitMQ = require("../core/RabbitMQ")

const Consumers  = async () => {
    // 1. Normal Queue
    // const queueName = 'email.send.v1.dev'
    // await RabbitMQ.consumeQueue(queueName, (msg) => {
    //     console.log("📥 Normal queue received:", msg);
    // });

    // // 2. Fanout
    // const exchangeName = 'order.commands.v1'
    // await RabbitMQ.subscribe(exchangeName, "fanout", "", (msg) => {
    // console.log("📥 Fanout received:", msg);
    // });

    // 3. Direct
    // const exchangeDirect = 'email.events.v1'
    // await RabbitMQ.subscribe(exchangeDirect, "direct", "info", (msg) => {
    //     console.log("📥 Direct INFO received:", msg);
    // });
    //   await RabbitMQ.subscribe(exchangeDirect, "direct", "error", (msg) => {
    //     console.log("📥 Direct ERROR received:", msg);
    // });

    // 4. Topic 
    const exchangeTopic= 'email.topics.v1'
    await RabbitMQ.subscribe(exchangeTopic, "topic", "*.*", (msg) => {
        console.log("📥 Topic user.* received:", msg);
    });

}

Consumers()
