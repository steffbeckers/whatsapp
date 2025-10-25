const express = require("express");
const { Client, Poll } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const { LocalAuth } = require("whatsapp-web.js");
const { format, startOfTomorrow } = require("date-fns");

const API_KEY = process.env.API_KEY ?? "secret";
const COSY_POLL_CHAT_ID = process.env.COSY_POLL_CHAT_ID ?? "32499765192@c.us";

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  if (req.path === "/") {
    return next();
  }

  const apiKey = req.headers["x-api-key"] ?? req.query.apiKey;

  if (!apiKey || apiKey !== API_KEY) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  next();
});

const whatsApp = new Client({
  authStrategy: new LocalAuth({
    dataPath: "./.browser_cache",
  }),
  puppeteer: {
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  },
});

let isReady = false;

whatsApp.once("ready", async () => {
  isReady = true;
  console.log("WhatsApp is ready");

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

whatsApp.on("disconnected", (reason) => {
  isReady = false;
  console.warn("WhatsApp disconnected:", reason);
});

whatsApp.initialize();

app.get("/", (req, res) => {
  res.json({ ready: isReady });
});

app.get("/send-cosy-poll", async (req, res) => {
  try {
    if (!isReady) {
      return res
        .status(503)
        .json({ error: "WhatsApp client not ready yet. Scan the QR and wait for 'ready'." });
    }

    const message = await whatsApp.sendMessage(
      COSY_POLL_CHAT_ID,
      new Poll(`Cosy Friday ${format(startOfTomorrow(), "dd/MM")}`, [
        "Voor 19u aanwezig",
        "Voor 20u aanwezig",
      ])
    );

    console.log("Cosy Friday poll sent");

    res.json({
      status: "sent",
      id: message.id.id,
      timestamp: message.timestamp,
    });
  } catch (err) {
    console.error("Send failed:", err);
    res.status(500).json({ error: "Failed to send message", details: String(err.message || err) });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Listening on: http://localhost:${PORT}`);
});
