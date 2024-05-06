//* LIB
const amqp = require("amqplib");

//* REQUIRED
const config = require("./src/config");

const publishLog = async (logType, message) => {
  try {
    const connection = await amqp.connect(config.rabbitMQ.url);
    const channel = await connection.createChannel();
    const exchange = config.rabbitMQ.exchange;

    //* Variable exchange kind fanout
    await channel.assertExchange(exchange, "fanout", { durable: false });

    //* Publish message with kind log specifically
    await channel.publish(exchange, "", Buffer.from(`${logType}: ${message}`));
    console.log(`[x] Sent ${logType} log: ${message}`);

    await channel.close();
    await connection.close();
  } catch (error) {
    console.error("Error:", error);
  }
};

// publishLog("info", "This is an information message");
// publishLog("warning", "This is a warning message");
publishLog("error", "This is an error message");

// TH1 node Publisher.js info "This is an information message"
// TH2 node Publisher.js warning "This is a warning message"
// TH3 node Publisher.js error "This is an error message"
