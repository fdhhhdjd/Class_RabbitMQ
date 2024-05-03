const rabbitClient = require("./rabbitmq/client");

class MessageHandler {
  static async handle(operation, data, correlationId, replyTo) {
    let response = {};

    const { num1, num2 } = data;

    console.log("The operation is", operation);

    switch (operation) {
      case "multiply":
        response = num1 * num2;
        break;

      case "sum":
        response = num1 + num2;
        break;

      default:
        response = 0;
        break;
    }

    // Produce the response back to the client
    await rabbitClient.produce(response, correlationId, replyTo);
  }
}

module.exports = MessageHandler;
