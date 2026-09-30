const express = require("express");
const router = express.Router();

const patientsRoutes = require("./patients");
const vitalsRoutes = require("./vitals");

router.use("/patients", patientsRoutes);
router.use("/patients/:id/vitals", vitalsRoutes);

module.exports = router;
