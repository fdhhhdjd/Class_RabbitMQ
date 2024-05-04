const RabbitClient = require("./client");

const Demo = (response, correlationId, replyTo) => {
  RabbitClient.initialize();
};

module.exports = Demo;
