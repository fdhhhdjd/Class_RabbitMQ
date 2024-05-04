//* REQUIRE
const RabbitClient = require("./src/rabbitmq/client");

(async () => {
  try {
    await RabbitClient.initialize();
    console.log("RabbitMQ setup completed.");
  } catch (error) {
    console.error("Error setting up RabbitMQ:", error);
  }
})();
