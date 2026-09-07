const http = require("http");
const fs = require("fs");
const path = require("path");

// Map file extensions to Content-Type
// MIME types (Multipurpose Internet Mail Extensions - a standard for identifyng file types so clients know how to handle them)
const MIME_TYPES = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".pdf": "application/pdf",
};

function serveStaticFile(req, res, staticDir) {
  // Build the full file path
  // path.join prevents directory traversal attacks
  // (where a malicious client sends '../../etc/passwd' to read system files)

  const filePath = path.join(
    staticDir,
    req.url === "/" ? "index.html" : req.url,
  );

  // Check the file extension to determine Content-Type
  const ext = path.extname(filePath);
  const contentType = MIME_TYPES[ext] || "application/octet-stream";
  // 'application/octet-stream' is the generic binary file type —
  // tells the client "this is some kind of file, treat it as a download"

  // Check if the file exists before trying to read it
  if (!fs.existsSync(filePath)) {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "File not found" }));
    return;
  }

  // Stream the file — don't load it entirely into memory
  // This is the same .pipe()

  const fileStream = fs.createReadStream(filePath);
  res.writeHead(200, { "Content-Type": contentType });
  fileStream.pipe(res); // pipe file contents directly into the response stream

  // Handle errors (file exists but can't be read — permissions etc.)
  fileStream.on("error", (err) => {
    console.error("File stream error:", err);
    res.writeHead(500);
    res.end("Internal server error");
  });
}

const server = http.createServer((req, res) => {
  const staticDir = path.join(__dirname, "public");

  if (req.url.startsWith("/api")) {
    // API routes — handle separately
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "API response" }));
  } else {
    // Everything else — try to serve as a static file
    serveStaticFile(req, res, staticDir);
  }
});

server.listen(3000, () => console.log("Server with static files running"));
