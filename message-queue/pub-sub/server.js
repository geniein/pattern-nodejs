const net = require("net");
const redis = require("redis");

const PORT = 4000;

const server = new net.createServer();

server.on("error", (err) => {
  console.log("error");
  throw err;
});

server.on("connection", () => {
  console.log("client in");
});

server.listen(PORT, () => {
  console.log(`server is starting on ${server.address()}:${PORT}`);
});
