const qrcode = require("qrcode-terminal");

qrcode.generate(process.argv[2], {
  small: true,
});
