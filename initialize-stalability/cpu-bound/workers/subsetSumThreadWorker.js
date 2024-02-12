const { parentPort } = require("worker_threads");
const SubsetSum = require("../subsetSum.js");

parentPort.on("message", (msg) => {
  const subsetSum = new SubsetSum(msg.sum, msg.set);

  subsetSum.on("match", (data) => {
    parentPort.postMessage({ event: "match", data: data });
  });

  subsetSum.on("end", (data) => {
    parentPort.postMessage({ event: "end", data: data });
  });

  subsetSum.start();
});
