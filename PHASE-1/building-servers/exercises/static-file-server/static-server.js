const http = require("http");
const fs = require("fs");
const path = require("path");

// MIME types — maps file extensions to Content-Type values
// MIME (Multipurpose Internet Mail Extensions) tells the browser
// what kind of file it's receiving so it knows how to handle it
const MIME_TYPES = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".ico": "image/x-icon",
};

const PUBLIC_DIR = path.join(__dirname, "public");

// ─── DIRECTORY LISTING ────────────────────────────────────────────────────

function serveDirListing(res, dirPath, urlPath) {
  // Read all files and folders in the directory
  const items = fs.readdirSync(dirPath);

  // Build an HTML page listing everything
  const links = items
    .map((item) => {
      const itemURL = urlPath === "/" ? `/${item}` : `${urlPath}/${item}`;
      return `<li><a href="${itemURL}">${item}</a></li>`;
    })
    .join("\n");

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Directory: ${urlPath}</title>
        <style>
          body { font-family: Arial, sans-serif; max-width: 600px; margin: 40px auto; }
          h1 { color: #2c3e50; }
          li { margin: 8px 0; }
          a { color: #3498db; text-decoration: none; }
          a:hover { text-decoration: underline; }
        </style>
      </head>
      <body>
        <h1>Directory: ${urlPath}</h1>
        <ul>
          ${links}
        </ul>
      </body>
    </html>
  `;

  res.writeHead(200, { "Content-Type": "text/html" });
  res.end(html);
}

// ─── STATIC FILE SERVER ───────────────────────────────────────────────────

function serveStaticFile(req, res) {
  // Build the full file system path from the URL
  // path.join prevents directory traversal — a security attack where
  // a malicious URL like '../../etc/passwd' tries to escape the public folder
  let filePath = path.join(PUBLIC_DIR, req.url);

  console.log(`\nRequest: ${req.method} ${req.url}`);
  console.log(`Looking for: ${filePath}`);

  // Check if path exists at all
  if (!fs.existsSync(filePath)) {
    console.log("Not found — 404");
    res.writeHead(404, { "Content-Type": "text/html" });
    res.end(`<h1>404 — File Not Found</h1><p>${req.url} does not exist</p>`);
    return;
  }

  const stat = fs.statSync(filePath);
  // stat gives us file/folder information
  // stat.isDirectory() tells us if the path is a folder not a file

  // ── If it's a directory ─────────────────────────────────────────────
  if (stat.isDirectory()) {
    // First: look for index.html inside this directory
    const indexPath = path.join(filePath, "index.html");

    if (fs.existsSync(indexPath)) {
      // index.html found — serve it instead
      console.log(`Directory — serving index.html: ${indexPath}`);
      filePath = indexPath;
      // fall through to file serving below
    } else {
      // No index.html — show directory listing
      console.log(`Directory — no index.html — showing listing`);
      serveDirListing(res, filePath, req.url);
      return;
    }
  }

  // ── Serve the file ──────────────────────────────────────────────────
  const ext = path.extname(filePath);
  const contentType = MIME_TYPES[ext] || "application/octet-stream";
  // 'application/octet-stream' = generic binary — browser will download it
  // used for any extension we don't recognize

  const fileSize = fs.statSync(filePath).size;

  console.log(`Serving: ${filePath}`);
  console.log(`Size: ${fileSize} bytes`);
  console.log(`Content-Type: ${contentType}`);

  res.writeHead(200, {
    "Content-Type": contentType,
    "Content-Length": fileSize,
    // Content-Length tells the browser exactly how many bytes to expect
    // This allows the browser to show a progress bar for large files
  });

  // Stream the file — don't load entirely into memory
  // .pipe() connects the readable file stream to the writable response stream
  const fileStream = fs.createReadStream(filePath);
  fileStream.pipe(res);

  // Handle file read errors
  fileStream.on("error", (err) => {
    console.error("File stream error:", err);
    // Can't set headers here — they were already sent in writeHead above
    // Just destroy the connection
    res.destroy();
  });
}

// ─── SERVER ───────────────────────────────────────────────────────────────

const server = http.createServer((req, res) => {
  // Only handle GET requests — static files don't respond to POST etc.
  if (req.method !== "GET") {
    res.writeHead(405, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Method not allowed" }));
    return;
  }

  serveStaticFile(req, res);
});

server.listen(3000, () => {
  console.log("Static file server running at http://localhost:3000");
});
