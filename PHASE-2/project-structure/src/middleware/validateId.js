const { ValidationError } = require("../utils/errors");

function validateId(req, res, next) {
  const id = parseInt(req.params.id);

  if (!id || isNaN(id)) {
    throw new ValidationError("ID is needed must and be a number");
  }

  req.patientId = id;
  next();
}

module.exports = validateId;
