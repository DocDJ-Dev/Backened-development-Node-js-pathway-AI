let count = 0;
let ip;

function rateLimiter(req, res, next) {
  count++;
  console.log(count);
  ip = req.ip;
  console.log(ip);

  while (count > 10 && ip === req.ip) {
    setTimeout(() => {
      count = 0;
    }, 60000);
    return res.status(429).json({
      error: "Too many requests",
      retryAfter: 60,
      code: "RATE_LIMITED",
    });
  }

  next();
  return count;
}

module.exports = rateLimiter;
