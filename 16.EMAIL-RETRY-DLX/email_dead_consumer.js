const amqp = require("amqplib");

const EmailDeadConsumer = async () => {
  const connection = await amqp.connect("amqp://taiheo:taiheodev@localhost");
  const channel = await connection.createChannel();

  const ExchangeDead = "email.dead.ex";
  const queueDead = "email.dead";

  await channel.assertExchange(ExchangeDead, "fanout", { durable: true });
  await channel.assertQueue(queueDead, { durable: true });
  await channel.bindQueue(queueDead, ExchangeDead, "");

  console.log("[*] Waiting for DEAD emails...");

  channel.consume("email.dead", (msg) => {
    console.log(" [DEAD]", msg.content.toString());
    channel.ack(msg);
  });
};

EmailDeadConsumer().catch(console.error);
