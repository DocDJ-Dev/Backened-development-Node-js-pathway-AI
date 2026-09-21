function validateId(req, res, next) {
  const id = parseInt(req.params.id);

  if (!id || isNaN(id)) {
    return res
      .status(400)
      .json({ error: "ID is needed must and be a number", code: "INVALID_ID" });
  }

  req.patientId = id;
  next();
}

module.exports = validateId;
