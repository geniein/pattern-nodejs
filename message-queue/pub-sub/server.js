const net = require("net");
const { resolve } = require("path");
const redis = require("redis");

const PORT = 4000;

const server = new net.Server();

let redisSub;
let redisPub;

new redis.createClient()
  .on("error", (err) => console.log("Redis Client Error", err))
  .connect()
  .then((redis) => {
    redisPub = redis;
    // redisSub = redis.duplicate();
  });
new redis.createClient()
  .on("error", (err) => console.log("Redis Client Error", err))
  .connect()
  .then((redis) => {
    // redisPub = redis;
    redisSub = redis;
  });

server.on("connection", (client) => {
  //ID 부여
  client.id = Math.floor(Math.random() * 1000);
  //Encoding UTF8
  client.setEncoding("utf8");
  console.log("Client connected");
  client.on("error", (err) => {
    console.log(err);
  });

  redisSub.subscribe("chat_messages", (msg) => {
    client.write(msg);
  });

  client.on("data", (data) => {
    console.log(`Message(${client.id}): ${data}`);
    redisPub.publish("chat_messages", `ID(${client.id}): ${data}`);
  });
});

server.on("error", (err) => {
  console.log("error");
  //   throw err;
});

server.on("close", (client) => {
  console.log(client);
  console.log("bye");
});

server.listen(PORT, () => {
  console.log(
    `server is starting on ${server.address().address}:${server.address().port}`
  );
});
