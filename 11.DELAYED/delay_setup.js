const amqp = require("amqplib");

const setupDelay = async () => {
  const connection = await amqp.connect("amqp://taiheo:taiheodev@localhost");
  const channel = await connection.createChannel();

  const queueDelay = "delayed_target_queue";
  const ExchangeDelay = "main_exchange";
  const routing = "go";

  await channel.assertExchange(ExchangeDelay, "direct", { durable: true });
  await channel.assertQueue(queueDelay, { durable: true });
  await channel.bindQueue(queueDelay, ExchangeDelay, routing);

  // Queue delay: sau TTL, dead-letter sang main_exchange với routing-key 'go'
  const _10_seconds = 10000;
  const queueDelay10s = "delay_queue_10s";

  await channel.assertQueue(queueDelay10s, {
    durable: true,
    arguments: {
      "x-dead-letter-exchange": ExchangeDelay,
      "x-dead-letter-routing-key": routing,
      "x-message-ttl": _10_seconds,
    },
  });

  console.log(" [*] Delay setup ready.");
  await channel.close();
  await connection.close();
};

setupDelay().catch(console.error);
