// Runs when NO route matched the request
// Must be registered after all routes in app.js
// Express automatically passes control to it when nothing else matched

function notFound(req, res, next) {
  res.status(404).json({
    error: "Route not found",
    method: req.method,
    path: req.path,
    suggestion: "Check the URL and HTTP method",
  });
}

module.exports = notFound;
