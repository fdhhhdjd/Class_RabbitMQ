const amqp = require("amqplib");

const EmailProducer = async () => {
  const connection = await amqp.connect("amqp://taiheo:taiheodev@localhost");
  const channel = await connection.createChannel();

  // Exchanges
  const ExchangeMain = "email.main.ex";
  const ExchangeRetry = "email.retry.ex";
  const ExchangeDead = "email.dead.ex";

  await channel.assertExchange(ExchangeMain, "direct", { durable: true });
  await channel.assertExchange(ExchangeRetry, "direct", { durable: true });
  await channel.assertExchange(ExchangeDead, "fanout", { durable: true });

  // Queues
  // Retry queue: TTL 10s, hết TTL sẽ DLX sang email.main.ex (routing key: email)
  const queueRetry = "email.retry";
  const _10_second = 10000;
  const routingMain = "email";

  await channel.assertQueue(queueRetry, {
    durable: true,
    arguments: {
      "x-message-ttl": _10_second,
      "x-dead-letter-exchange": ExchangeMain,
      "x-dead-letter-routing-key": routingMain,
    },
  });

  // Main queue: khi reject sẽ DLX sang email.retry.ex (routing key: retry)

  const queueMain = "email.main";
  const routingRetry = "retry";
  await channel.assertQueue(queueMain, {
    durable: true,
    arguments: {
      "x-dead-letter-exchange": ExchangeRetry,
      "x-dead-letter-routing-key": routingRetry,
    },
  });

  // Dead queue: nơi cất giữ sau khi retry quá số lần
  const queueDead = "email.dead";
  await channel.assertQueue(queueDead, { durable: true });

  // Bindings
  await channel.bindQueue(queueMain, ExchangeMain, routingMain);
  await channel.bindQueue(queueRetry, ExchangeRetry, routingRetry);
  await channel.bindQueue(queueDead, ExchangeDead, "");

  // GỬI DATA MẪU (3 email: 1 fail ngẫu nhiên, 1 chắc chắn fail, 1 chắc chắn ok)
  const samples = [
    {
      to: "user1@example.com",
      subject: "Welcome",
      body: "Hello 1",
      shouldFail: "random",
    },
    {
      to: "user2@example.com",
      subject: "Invoice",
      body: "Hello 2",
      shouldFail: "always",
    },
    {
      to: "user3@example.com",
      subject: "Promo",
      body: "Hello 3",
      shouldFail: "never",
    },
    {
      to: "user4@example.com",
      subject: "Taiheo",
      body: "Hello 4",
      shouldFail: "random",
    },
    {
      to: "user5@example.com",
      subject: "What",
      body: "Hello 5",
      shouldFail: "random",
    },
    {
      to: "user6@example.com",
      subject: "Hello",
      body: "Hello 6",
      shouldFail: "random",
    },
  ];

  for (const mail of samples) {
    const payload = Buffer.from(JSON.stringify(mail));
    channel.publish(ExchangeMain, routingMain, payload, { persistent: true });
    console.log(
      " [x] Enqueued email:",
      mail.to,
      mail.subject,
      `(fail=${mail.shouldFail})`
    );
  }

  await channel.close();
  await connection.close();
};

EmailProducer().catch(console.error);

// I. Main
// 2 message success and 1 message fail
// 2 Message success => Send email , 1 message fail: retry 2 lan.
// if 1 message fail retry 3 times fail send dead
