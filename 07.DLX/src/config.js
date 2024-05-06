//* LIB
const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  rabbitMQ: {
    url: `amqp://${process.env.RABBITMQ_DEFAULT_USER}:${process.env.RABBITMQ_DEFAULT_PASS}@localhost`,
    notificationExchange: "NotificationEx",
    notificationQueue: "notificationQueueProcess", // assert Queue (4)
    notificationExDLX: "notificationExDLX", // notification direct
    notificationRoutingKeyDLX: "notificationRoutingKeyDLX", // notification assert
    notificationHotFix: "notificationHotFix", // notification assert
  },
};
