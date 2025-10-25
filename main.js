const { Client, Poll } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const { LocalAuth } = require("whatsapp-web.js");
const { format, startOfTomorrow } = require("date-fns");

const whatsApp = new Client({
  authStrategy: new LocalAuth({
    dataPath: "./.browser_cache",
  }),
  puppeteer: {
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  },
});

whatsApp.once("ready", async () => {
  console.log("WhatsApp is ready!");

  // await whatsApp.sendMessage(
  //   "32499765192@c.us",
  //   new Poll(`Cosy Friday ${format(startOfTomorrow(), "dd/MM")}`, [
  //     "Voor 19u aanwezig",
  //     "Voor 20u aanwezig",
  //   ])
  // );

  // // Get all chats
  // const chats = await client.getChats();

  // // Filter individual chats
  // const individuals = chats.filter((chat) => !chat.isGroup);

  // console.log(`Found ${individuals.length} individuals:`);
  // individuals.forEach((individual) => {
  //   console.log(`- ${individual.name} (${individual.id._serialized})`);
  // });

  // // Filter group chats
  // const groups = chats.filter((chat) => chat.isGroup);

  // console.log(`Found ${groups.length} groups:`);
  // groups.forEach((group) => {
  //   console.log(`- ${group.name} (${group.id._serialized})`);
  // });
});

whatsApp.on("qr", (qr) => {
  console.log(`QR: ${qr}`);

  qrcode.generate(qr, {
    small: true,
  });
});

whatsApp.initialize();
