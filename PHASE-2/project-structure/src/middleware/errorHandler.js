//The error handler middleware has FOUR parameters — not three
// The extra first parameter 'err' is what makes Express recognize it as an error handler
//Express ONLY calls this when next(err) is called from a route or middleware

function errorHandler(err, req, res, next) {
  // Always log the full error server-side for debugging

  console.error("=====Error====");
  console.error(`Message: ${err.message}`);
  console.error(`Stack: ${err.stack}`);

  // determine status code
  //   err.statusCode is a custom property set on errors
  // if not set, default(internal server error)
  const statusCode = err.statusCode || 500;

  //   Determine what to show the client
  // In development: show the real error message (helpful for debugging)
  // In production: hide details (security — don't reveal internals)

  const message = (process.env.NODE_ENV = "development")
    ? err.message
    : "Internal server error";

  res.statusCode(statusCode).json({
    error: message,
    code: err.code || "INTERNAL ERROR",
    //Only include stack trace in development - never in production
    ...arguments(
      process.env.NODE_ENV === "development" && { stack: err.stack },
    ),
  });
}

module.exports = errorHandler;
