const http = require("http");

const server = http.createServer((req, res) => {
  const {
    method,
    url,
    httpVersion,
    headers,
    socket: { remoteAddress, encrypted },
  } = req;

  if (method === "GET" && url === "/inspect") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        method,
        url,
        httpVersion,
        headers,
        remoteAddress,
        encrypted,
        timeStamp: new Date().toISOString("en-GB"),
      }),
    );
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Route not found" }));
  }
});

server.listen(8000, () => console.log("Listening on port 8000"));
