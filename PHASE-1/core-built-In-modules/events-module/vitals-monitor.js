const EventEmitter = require("events");

class VitalsMonitor extends EventEmitter {
  constructor() {
    super();
  }

  recordVitals(patientId, vitals) {
    // object version of parameters. Named parameters prevent cross matching
    // destructuring the object
    const { heartRate, bloodPressure, oxygenLevel } = vitals;

    // corrected logic as required by the question
    if (heartRate < 30 && oxygenLevel < 85) {
      // both critically low simultaneously
      this.emit("codeBlue", { patientId, vitals });
    } else if (heartRate < 40 || heartRate > 120 || oxygenLevel < 90) {
      this.emit("critical", { patientId, vitals });
    } else if (heartRate < 60 || heartRate > 100 || oxygenLevel <= 94) {
      this.emit("warning", { patientId, vitals });
    } else {
      this.emit("normal", { patientId, vitals });
    }
  }
}

const vitalchecker = new VitalsMonitor();

vitalchecker.once("codeBlue", ({ patientId, vitals }) => {
  console.log(
    `CODE BLUE- IMMEDIATE RESPONSE REQUIRED: for patient ${patientId}`,
  );
  console.log(`Vitals: HR(${vitals.heartRate}) | O2: (${vitals.oxygenLevel})`);
});

vitalchecker.on("critical", ({ patientId, vitals }) => {
  (console.log(
    `Urgently attend the patient the patient with Id ${patientId}: CRITICAL READINGS`,
  ),
    console.log(`Vitals: HR(${vitals.heartRate}) | O2(${vitals.oxygenLevel})`));
});

vitalchecker.on("warning", ({ patientId, vitals }) => {
  (console.log(
    `Please be WARNED about patient ${patientId}, one of vitals slightly out of range `,
  ),
    console.log(`Vitals: HR(${vitals.heartRate}) | O2(${vitals.oxygenLevel})`));
});

vitalchecker.on("normal", ({ patientId }) =>
  console.log(`${patientId} safe, all vitals are essentially normal`),
);

vitalchecker.recordVitals(1, {
  heartRate: 72,
  bloodPressure: "120/80",
  oxygenLevel: 97,
});
vitalchecker.recordVitals(2, {
  heartRate: 72,
  bloodPressure: "120/80",
  oxygenLevel: 92,
});
vitalchecker.recordVitals(3, {
  heartRate: 72,
  bloodPressure: "120/80",
  oxygenLevel: 88,
});
vitalchecker.recordVitals(4, {
  heartRate: 25,
  bloodPressure: "120/80",
  oxygenLevel: 82,
});
vitalchecker.recordVitals(5, {
  heartRate: 25,
  bloodPressure: "120/80",
  oxygenLevel: 82,
});
