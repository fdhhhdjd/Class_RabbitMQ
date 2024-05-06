//* LIB
const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  rabbitMQ: {
    url: `amqp://${process.env.RABBITMQ_DEFAULT_USER}:${process.env.RABBITMQ_DEFAULT_PASS}@localhost`,
    queues: {
      workQueues: "work-queues",
    },
  },
};
