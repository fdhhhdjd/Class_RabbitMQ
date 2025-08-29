module.exports = {
  RABBITMQ_URL: "amqp://taiheo:taiheodev@localhost",

  // Default queue name
  QUEUE_DEFAULT: "my_default_queue",

  // Exchanges
  EXCHANGES: {
    FANOUT: "my_fanout_exchange",
    DIRECT: "my_direct_exchange",
    TOPIC: "my_topic_exchange",
    HEADERS: "my_headers_exchange",
  },
};
