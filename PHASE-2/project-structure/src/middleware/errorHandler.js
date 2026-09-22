const dotenv = require("dotenv");

result = dotenv.config();

//The error handler middleware has FOUR parameters — not three
// The extra first parameter 'err' is what makes Express recognize it as an error handler
//Express ONLY calls this when next(err) is called from a route or middleware

function errorHandler(err, req, res, next) {
  // Always log the full error server-side for debugging

  console.error("=====Error====");
  console.error(`Message: ${err.message}`);
  console.error(`Stack: ${err.stack}`);
  console.error("=====Error====");

  // determine status code
  //   err.statusCode is a custom property set on errors
  // custom classes have statusCodes
  // if not set, default(internal server error)
  const statusCode = err.statusCode || 500;
  const code = err.code || "INTERNAL_ERROR";

  //   Determine what to show the client
  // In development: show the real error message (helpful for debugging)
  // In production: hide details (security — don't reveal internals)
  const isProduction = process.env.NODE_ENV === "production";

  const message =
    err.isOperational || !isProduction
      ? err.message
      : "Something went wrong. Please try again later.";

  const response = {
    error: message,
    code,
  };

  // Include validation details if present (e.g. which fields failed)
  if (err.details) {
    response.details = err.details;
  }

  //Include stack trace ONLY in development — never in production
  if (!isProduction) {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
}

module.exports = errorHandler;
