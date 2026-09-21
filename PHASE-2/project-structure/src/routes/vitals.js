const express = require("express");
const router = express.Router({ mergeParams: true });
const authorize = require("../middleware/authorize");
const auth = require("../middleware/auth");

// mergeParams: true is CRITICAL here
// Without it, params from the parent route (/api/patients/:id)
// are NOT available inside this router
// With it, req.params.id from the parent is accessible here

// In-memory vitals store
const vitalsStore = {};
// Structure: { patientId: [{ id, heartRate, bloodPressure, oxygenLevel, recordedAt }] }

// POST
router.post("/", authorize("doctor", "nurse"), (req, res) => {
  const patientId = parseInt(req.params.id);

  if (isNaN(patientId)) {
    return res.status(400).json({ error: "Patient ID must be a number" });
  }

  const { heartRate, bloodPressure, oxygenLevel } = req.body;

  if (!heartRate || !bloodPressure || !oxygenLevel) {
    return res.status(400).json({
      error: "heartRate, bloodPressure and oxygenLevel are required",
      code: "VALIDATION_ERROR",
    });
  }
  const alertLevel = determineAlertLevel(heartRate, oxygenLevel);

  const vitalsRecord = {
    id: Date.now(),
    heartRate,
    bloodPressure,
    oxygenLevel,
    alertLevel,
    recordedAt: new Date().toISOString(),
  };
  if (!vitalsStore[patientId]) vitalsStore[patientId] = [];
  vitalsStore[patientId].push(vitalsRecord);

  res.status(201).json(vitalsRecord);
});

//  GET /api/patients/:id/vitals/latest
// MUST come BEFORE /:vitalId — specific routes before dynamic ones
router.get("/latest", (req, res) => {
  const patientId = parseInt(req.params.id);
  const patientVitals = vitalsStore[patientId] || [];

  if (patientVitals.length === 0) {
    return res.status(404).json({
      error: "No vitals recorded for this patient",
      code: "NOT_FOUND",
    });
  }

  const latest = patientVitals[patientVitals.length - 1];
  res.json(latest);
});

// ── GET /api/patients/:id/vitals

router.get("/", (req, res) => {
  const patientId = parseInt(req.params.id);
  const patientVitals = [...(vitalsStore[patientId] || [])].reverse();

  res.json({
    count: patientVitals.length,
    vitals: patientVitals,
  });
});

function determineAlertLevel(heartRate, oxygenLevel) {
  if (heartRate < 30 || oxygenLevel < 85) return "codeBlue";
  if (heartRate < 40 || heartRate > 120 || oxygenLevel < 90) return "critical";
  if (heartRate < 60 || heartRate > 100 || oxygenLevel <= 94) return "warning";
  return "normal";
}

module.exports = router;
