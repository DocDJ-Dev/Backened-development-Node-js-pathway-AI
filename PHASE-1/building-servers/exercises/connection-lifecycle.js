const http = require("http");
// let timeStamp = Date.now();
let connectionId = 0;

const server = http.createServer((req, res) => {
  const id = req.socket.id;

  console.log(
    `[Conn ${id}] Request arrived: ${req.method} ${req.url} at ${Date.now()}`,
  );

  res.writeHead(200, { "Content-Type": "application/json" });

  res.on("finish", () => {
    console.log(`[Conn ${id}] Response finished at ${Date.now()}`);
  });

  res.end(
    JSON.stringify({
      message: "Connection lifecycle logged",
      connectionId: id,
      method: req.method,
      url: req.url,
    }),
  );
});

server.on("connection", (socket) => {
  connectionId++;
  socket.id = connectionId;

  console.log(`[Conn ${socket.id}] TCP connection estabished at ${Date.now()}`);

  socket.on("close", () => {
    console.log(`[Conn ${socket.id}] TCP connection closed at ${Date.now()}`);
  });
});

server.listen(3000, () => console.log("Listening on Port 3000"));
