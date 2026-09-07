// Inspecting res as a writable stream

const http = require("http");

const server = http.createServer((req, res) => {
  if (req.url === "/stream") {
    res.writeHead(200, {
      "content-type": "text/plain",
      "transfer-encoding": "chunked",
    });

    let count = 0;
    const interval = setInterval(() => {
      count++;
      const chunk = `Medical report chunk ${count}: patient data segment...\n`;
      res.write(chunk);
      console.log(`sent chunk ${count}`);

      if (count === 5) {
        clearInterval(interval);
        res.end("\nReport compete");
        console.log("Response stream ended");
      }
    }, 500);
  } else if (req.url === "/instant") {
    res.writeHead(200, {
      "content-type": "application/json",
    });
    res.end(JSON.stringify({ message: "This arrives all at once" }));
  } else {
    res.writeHead(404);
    res.end("not found");
  }
});

server.listen(3000, console.log("listening at server 3000..."));
