const path = require("path");
const fs = require("fs");

const filePath = path.join(__dirname, "app.log");

function readFile(callback) {
  fs.readFile(filePath, "utf-8", (err, result) => {
    if (err) {
      if (err.code === "ENOENT") {
        return callback(null, []);
      }
      return callback(err, null);
    }

    return callback(null, result);
  });
}

function appendData(log, callback) {
  fs.appendFile(filePath, log, "utf-8", (err) => {
    if (err) {
      return callback(err);
    }

    console.log("Log added successfully");
    return;
  });
}

function main(message) {
  let logs;

  readFile((err, result) => {
    if (err) {
      console.log("Failed:", err.message);
    }

    if ((result = [])) {
      logs = result;
    } else {
      const data = JSON.parse(result);
      logs = data;
    }

    const newLog = `[${new Date().toISOString()}] ${message}`;

    appendData(newLog, (err) => {
      if (err) {
        console.log("Failed", err);
        return;
      }
      return;
    });
  });
}
main("First logging message\n");
main("second log message\n");
main("third log message\n");
