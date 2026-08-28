const EventEmitter = require("events");

class MedicalTracker extends EventEmitter {
  #medications;

  constructor() {
    super();
    this.#medications = [];
  }

  addMedication(patientId, medicationName, timeDailyCount) {
    const newMedication = { patientId, medicationName, timeDailyCount };
    this.#medications.push(newMedication);
    this.emit("addedMedication", { patientId, medicationName, timeDailyCount });
  }

  recordDose(patientId, medicationName) {
    this.emit("doseRecorded", { patientId, medicationName });
  }

  missedDose(patientId, medicationName) {
    this.emit("doseMissed", { patientId, medicationName });
  }
}

const p = new MedicalTracker();

p.on("addedMedication", ({ patientId, medicationName, timeDailyCount }) => {
  console.log(
    `Added ${medicationName} for patient with id ${patientId} and should be taken ${timeDailyCount} times per day`,
  );
});

p.on("doseRecorded", ({ patientId, medicationName }) => {
  console.log(`Dose taked by ${patientId} for ${medicationName}`);
});

p.on("doseMissed", ({ patientId, medicationName }) => {
  console.log(`Dose missed by ${patientId} for ${medicationName}`);
});

p.addMedication(1, "Amoxicillin", 3);
p.recordDose(2, "Paracetamol");
p.missedDose(4, "Spironolactone");
