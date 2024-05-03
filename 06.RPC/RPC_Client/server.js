//* LIB
const express = require("express");

//* REQUIRED
const RabbitMQClient = require("./src/rabbitmq/client");
const dotenv = require("dotenv");

const server = express();
dotenv.config();
server.use(express.json()); // you need the body parser middleware

server.post("/operate", async (req, res, next) => {
  console.log(req.body);
  const response = await RabbitMQClient.produce(req.body);
  res.send({ response });
});

server.listen(3001, async () => {
  console.log("Server running...");
  await RabbitMQClient.initialize();
});
