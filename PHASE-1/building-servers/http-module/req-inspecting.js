const http = require("http");

// Inspecting req as a readable stream

const server = http.createServer((req, res) => {
  console.log("======== New Request =========");
  console.log("Method", req.method);
  console.log("URL", req.url);
  console.log("Http Version", req.httpVersion);
  console.log("Headers", req.headers);

  console.log("\nIs req a readable stream", req.readable); //true

  let body = "";
  let chunkCount = 0;

  req.on("data", (chunk) => {
    chunkCount++;
    console.log(`\nChunk ${chunkCount} arrived`);
    console.log("Type", typeof chunk);
    console.log("Is Buffer", Buffer.isBuffer(chunk));
    console.log("Size", chunk.length, "bytes");
    console.log("Content", chunk.toString("utf-8"));
    body += chunk.toString("utf-8");
  });

  req.on("end", () => {
    console.log("\nAll total chunks received. Full Body:", body);
    console.log("Total chunks", chunkCount);

    res.writeHead(200, { "content-type": "application/json" });
    res.end(
      JSON.stringify({
        method: req.method,
        url: req.ur,
        bodyReceived: body,
        chunkCount,
      }),
    );
  });

  req.on("error", (err) => {
    console.error("Request stream error", err);
    res.writeHead(400);
    res.end("Bad Request");
  });
});

server.listen(3000, () => console.log("listening at port 3000..."));
