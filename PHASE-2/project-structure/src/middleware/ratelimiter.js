const { TooManyRequestsError } = require("../utils/errors");

let count = 0;
let ip;

function rateLimiter(req, res, next) {
  count++;
  ip = req.ip;

  while (count > 10 && ip === req.ip) {
    setTimeout(() => {
      count = 0;
    }, 60000);

    throw new TooManyRequestsError("Too many request. Try again after 60s");
  }

  next();
  return count;
}

module.exports = rateLimiter;
