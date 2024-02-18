function promisify(callbackApi) {
  return function promisifed(...args) {
    return new Promise((resolve, reject) => {
      const newArgs = [
        ...args,
        (err, data) => {
          if (err) return reject(err);

          resolve(data);
        },
      ];
      callbackApi(...newArgs);
    });
  };
}

const fs = require("fs");
const fsPromisify = promisify(fs.readFile);
const fsPromise = fs.promises;

fs.readFile(__dirname + "/testFile", (err, data) => {
  console.log(data.toString());
});

fsPromisify(__dirname + "/testFile").then((data) => {
  console.log("Promisify: ");
  console.log(data.toString());
});

fsPromise.readFile(__dirname + "/testFile").then((data) => {
  console.log("fsPromise: ");
  console.log(data.toString());
});
