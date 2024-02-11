if (process.argv[2] == "server") {
  console.log("---server---");
  require("./server.js");
} else {
  console.log("---client---");
  require("./client.js");
}
