//* LIB
const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  rabbitMQ: {
    url: `amqp://${process.env.RABBITMQ_DEFAULT_USER}:${process.env.RABBITMQ_DEFAULT_PASS}@localhost`,
    exchange: "header_exchange",
    queue1: "header_queue1",
    queue2: "header_queue2",
  },
};
