const EventEmitter = require("events");

class VitalsMonitor extends EventEmitter {
  constructor() {
    super();
  }

  recordVitals(patientId, heartRate, bloodPressure, oxygenLevel) {
    if (heartRate < 30 || oxygenLevel < 85) {
      this.emit("codeBlue", { patientId });
    } else if (heartRate < 40 || heartRate > 120 || oxygenLevel < 90) {
      this.emit("critical", { patientId });
    } else if (heartRate < 60 || heartRate > 100 || oxygenLevel <= 94) {
      this.emit("warning", { patientId });
    } else {
      this.emit("normal", patientId);
    }
  }
}

const vitalchecker = new VitalsMonitor();

vitalchecker.once("codeBlue", ({ patientId }) => {
  console.log(
    `CODE BLUE- IMMEDIATE RESPONSE REQUIRED: for patient ${patientId}`,
  );
});
vitalchecker.on("critical", ({ patientId }) =>
  console.log(
    `Urgently attend the patient the patient with Id ${patientId}: CRITICAL READINGS`,
  ),
);

vitalchecker.on("warning", ({ patientId }) =>
  console.log(
    `Please be WARNED about patient ${patientId}, one of vitals slightly out of range `,
  ),
);

vitalchecker.on("normal", () =>
  console.log(`patients are safe, all vitals are essentially normal`),
);

vitalchecker.recordVitals(1, 72, "120/80", 96);
vitalchecker.recordVitals(1, 160, "120/80", 96);
vitalchecker.recordVitals(1, 72, "120/80", 70);
vitalchecker.recordVitals(2, 25, "120/80", 96);
