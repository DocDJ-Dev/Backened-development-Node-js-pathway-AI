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
