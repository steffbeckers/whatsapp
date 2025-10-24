const { Client } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const { LocalAuth } = require("whatsapp-web.js");

// Create a new client instance
const client = new Client({
  authStrategy: new LocalAuth({
    dataPath: "./.browser_cache",
  }),
  puppeteer: {
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  },
});

// When the client is ready, run this code (only once)
client.once("ready", () => {
  console.log("Client is ready!");
});

// When the client received QR-Code
client.on("qr", (qr) => {
  qrcode.generate(qr, {
    small: true,
  });
});

// Start your client
client.initialize();
