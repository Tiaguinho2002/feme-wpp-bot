const { Client } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");

const client = new Client();

client.on("ready", () => {
  console.log("Client is ready!");
});

client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

client.on("message_create", (message) => {
  console.log(message);
  if (message.body === "!ping") {
    // send back "pong" to the chat the message was sent in
    client.sendMessage(message.from, "pong");
  }
});

client.initialize();

function formatPhoneNumber(number) {
  if (number.includes("@c.us") || number.includes("@g.us")) {
    return number;
  }
  return `${number.replace(/[^0-9]/g, "")}@c.us`;
}
