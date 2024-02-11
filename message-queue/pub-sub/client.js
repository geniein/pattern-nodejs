const net = require("net");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
const PORT = 4000;
const socket = new net.Socket();

const client = socket.connect(PORT);
client.setEncoding("utf8");

client.on("connect", () => {
  console.log("Server connected");
  rl.on("line", (line) => {
    client.write(line);
  });
});

client.on("data", (data) => {
  console.log(data);
});
