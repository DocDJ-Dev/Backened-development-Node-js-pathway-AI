function asyncHandler(fn) {
  // takes route handler and wraps it
  // rejected promises automatically calls next(err)
  // no try/catch in routes

  return (req, res, next) => {
    // wrap fn in Promise.resolve()
    // .catch(next) means: if the promise rejects, call next(err)
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

module.exports = asyncHandler;
