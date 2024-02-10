const net = require("net");

const PORT = 4000;

const client = new net.Socket();

client.connect(PORT).on("connect", () => {
  console.log("connect");
});
