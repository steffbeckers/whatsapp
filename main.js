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
client.once("ready", async () => {
  console.log("Client is ready!");

  // Get all chats
  const chats = await client.getChats();

  // Filter individual chats
  const individuals = chats.filter((chat) => !chat.isGroup);

  console.log(`Found ${individuals.length} individuals:`);
  individuals.forEach((individual) => {
    console.log(`- ${individual.name} (${individual.id._serialized})`);
  });

  // Filter group chats
  const groups = chats.filter((chat) => chat.isGroup);

  console.log(`Found ${groups.length} groups:`);
  groups.forEach((group) => {
    console.log(`- ${group.name} (${group.id._serialized})`);
  });

  await client.sendMessage("32499765192@c.us", "Cosy WhatsApp Poll Sender is ready!");
});

// When the client received QR-Code
client.on("qr", (qr) => {
  qrcode.generate(qr, {
    small: true,
  });
});

// Start your client
client.initialize();
