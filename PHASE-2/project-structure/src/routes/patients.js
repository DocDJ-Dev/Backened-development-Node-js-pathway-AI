const express = require("express");
// express.Router() creates a mini Express app — a self-contained collection of routes that can be mounted onto a path in app.js
// This is exactly like  createRouter() but built into Express
const router = express.Router();
const validateId = require("../middleware/validateId");
const authorize = require("../middleware/authorize");
const auth = require("../middleware/auth");

let patients = [
  { id: 1, name: "Alice Mwangi", age: 34, diagnosis: "Hypertension" },
  { id: 2, name: "James Mensah", age: 52, diagnosis: "Diabetes Type 2" },
  { id: 3, name: "Carol Osei", age: 28, diagnosis: "Asthma" },
];
let nextId = 4;

// GET
router.get("/", (req, res) => {
  let result = [...patients];

  // req.query is automatically parsed by Express
  // No Object.fromEntries needed
  if (req.query.search) {
    result = result.filter((p) =>
      p.name.toLowerCase().includes(req.query.search.toLowerCase()),
    );
  }

  if (req.query.diagnosis) {
    result = result.filter((p) =>
      p.diagnosis.toLowerCase().includes(req.query.diagnosis.toLowerCase()),
    );
  }

  // res.json() = Content-Type header + JSON.stringify + res.end() in one call
  res.json({ count: result.length, patients: result });
});

// GET
router.get("/:id", validateId, (req, res) => {
  const id = req.patientId;

  const patient = patients.find((p) => p.id === id);

  if (!patient) {
    return res.status(404).json({
      error: `Patient ${id} not found`,
      code: "NOT_FOUND",
    });
  }

  res.json(patient);
});

// POST
// No async needed — express.json() already parsed req.body synchronously
router.post("/", auth, authorize("doctor", "admin"), (req, res) => {
  const { name, age, diagnosis } = req.body;

  // Validation — if statements, not try/catch (expected conditions)
  if (!name) {
    return res
      .status(400)
      .json({ error: "name is required", code: "VALIDATION_ERROR" });
  }

  if (!age || typeof age !== "number" || age < 0 || age > 150) {
    return res.status(400).json({
      error: "age must be a number between 0 and 150",
      code: "VALIDATION_ERROR",
    });
  }

  const newPatient = {
    id: nextId++,
    name,
    age,
    diagnosis: diagnosis || "Pending assessment",
  };

  patients.push(newPatient);
  res.status(201).json(newPatient);
});

// PATCH
router.patch(
  "/:id",
  auth,
  authorize("doctor", "admin"),
  validateId,
  (req, res) => {
    const id = req.patientId;

    const index = patients.findIndex((p) => p.id === id);

    if (index === -1) {
      return res
        .status(404)
        .json({ error: `Patient ${id} not found`, code: "NOT_FOUND" });
    }

    // Prevent ID from being changed
    const { id: _removedId, ...updates } = req.body;
    // Destructuring trick: pull out 'id' into _removedId (ignored)
    // 'updates' now contains everything EXCEPT id

    if (Object.keys(updates).length === 0) {
      return res
        .status(400)
        .json({ error: "No fields to update", code: "VALIDATION_ERROR" });
    }

    if (updates.age !== undefined) {
      if (
        typeof updates.age !== "number" ||
        updates.age < 0 ||
        updates.age > 150
      ) {
        return res.status(400).json({
          error: "age must be a number between 0 and 150",
          code: "VALIDATION_ERROR",
        });
      }
    }

    // Spread operator merges objects — existing fields kept, sent fields overwritten
    patients[index] = { ...patients[index], ...updates };

    res.json(patients[index]);
  },
);

// DELETE
router.delete("/:id", auth, authorize("admin"), validateId, (req, res) => {
  const id = req.patientId;

  const index = patients.findIndex((p) => p.id === id);

  if (index === -1) {
    return res
      .status(404)
      .json({ error: `Patient ${id} not found`, code: "NOT_FOUND" });
  }

  const deleted = patients.splice(index, 1)[0];
  res.json({ message: "Patient deleted successfully", patient: deleted });
});

module.exports = router;
