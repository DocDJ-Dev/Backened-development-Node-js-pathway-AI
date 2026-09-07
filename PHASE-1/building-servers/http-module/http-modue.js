const http = require("http");

// const server = http.createServer((req, res) => {
//   console.log(`Incoming request: ${req.method} ${req.url}`);

//   res.writeHead(200, { "Content-Type": "application/json" });

//   res.end(
//     JSON.stringify({
//       message: "Hello from our first backened server",
//       method: req.method,
//       url: req.url,
//       timeStamp: new Date().toISOString(),
//     }),
//   );
// });

// server.listen(3000, () => {
//   console.log("server listening at Port 3000");
// });

// ROUTING

// const server = http.createServer((req, res) => {
//   const { method, url } = req;

//   if (method === "GET" && url === "/") {
//     res.writeHead(200, { "Content-Type": "application/json" });
//     res.end(JSON.stringify({ message: "Welcome to API." }));
//   } else if (method === "GET" && url === "/about") {
//     res.writeHead(200, { "Content-Type": "application/json" });
//     res.end(JSON.stringify({ name: "My backened Server", version: "1.0" }));
//   } else if (method === "POST" && url === "/echo") {
//     let body = "";

//     req.on("data", (chunk) => {
//       body += chunk.toString();
//     });

//     req.on("end", () => {
//       res.writeHead(200, { "Content-Type": "application/json" });
//       res.end(JSON.stringify({ message: "You send me this:", received: body }));
//     });
//   } else if (method === "GET" && url === "/time") {
//     res.writeHead(200, { "Content-Type": "application/json" });
//     res.end(JSON.stringify({ timestamp: new Date().toISOString() }));
//   } else if (method === "GET" && url === "/health") {
//     res.writeHead(200, { "Content-Type": "application/json" });
//     res.end(JSON.stringify({ status: "OK", uptime: process.uptime() }));
//   } else {
//     res.writeHead(404, { "Content-Type": "application/json" });
//     res.end(JSON.stringify({ error: "Route not found" }));
//   }
// });

// server.listen(3000, () => {
//   console.log("server listening on port 3000");
// });
