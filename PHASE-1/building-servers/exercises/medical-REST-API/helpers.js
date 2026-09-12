const fs = require("fs");

// Send Response

function sendResponse(req, res, statusCode, data) {
  const accept = req.headers.accept || "application/json";

  if (accept.includes("text/html")) {
    // client wants HTML - format data as a basic HTML
    const html = `<!DOCTYPE html>
      <html>
        <body>
          <h1>Response</h1>
          <pre>${JSON.stringify(data, null, 2)}</pre>
        </body>
      </html>
    `;
    res.writeHead(statusCode, { "Content-Type": "text/html" });
    res.end(html);
  } else {
    // Default to JSON for API clients
    res.writeHead(statusCode, { "Content-Type": "application/json" });
    res.end(JSON.stringify(data, null, 2));
  }
}

// read JSON body from request
function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";

    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(new Error("Invalid JSON body"));
      }
    });
    req.on("error", reject);
  });
}

function readFile(path) {
  return new Promise((resolve) => {
    const readStream = fs.createReadStream(path, "utf-8");

    let body = "";

    readStream.on("data", (chunk) => (body += chunk));

    readStream.on("end", () => {
      try {
        const parsed = JSON.parse(body);
        resolve(parsed);
      } catch (err) {
        resolve(null);
      }
    });

    readStream.on("error", (err) => {
      if (err.code === "ENOENT") {
        resolve("None");
      } else {
        resolve(null);
      }
    });
  });
}

async function writeFile(path, data) {
  await fs.promises.writeFile(path, JSON.stringify(data, null, 2));
}

module.exports = { sendResponse, readBody, readFile, writeFile };
