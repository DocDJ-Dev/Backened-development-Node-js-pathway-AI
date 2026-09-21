function logger(req, res, next) {
  const start = Date.now();

  // Log when the request arrives
  console.log(
    `[${req.requestId}]  ${req.method} ${req.url} ${new Date().toISOString()}`,
  );

  //   Listen for when the response finishes - then log the result

  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(
      `[${req.requestId}] ${req.method} ${req.url} ${res.statusCode} (${duration}ms)`,
    );
  });

  //   CRITICAL: Call next
  next();
}

module.exports = logger;
