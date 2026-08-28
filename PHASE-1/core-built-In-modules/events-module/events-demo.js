const EventEmmiter = require("events");

// // Direct Use
// // const emitter = new EventEmmiter();

// // Inheritance
// class PatientMonitor extends EventEmmiter {
//   constructor() {
//     super();
//     this.patients = [];
//   }

//   admitPatient(patient) {
//     this.patients.push(patient);
//     this.emit("patientAdmitted", patient); // .emit() is inherited from mother
//   }

//   recordVitals(patientId, vitals) {
//     if (vitals.heartRate > 20 || vitals.heartRate < 40) {
//       this.emit("criticalVitals", { patientId, vitals });
//     }
//   }
// }

// const monitor = new PatientMonitor();

// // Registration of listeners
// monitor.on("patientAdmitted", (patient) => {
//   console.log(`Nurse notified: ${patient.name} has been admitted`);
// });

// monitor.once("patientAdmitted", (patient) => {
//   console.log(`${patient.name} is the first patient to be admitted`);
// });

// monitor.on("patientAdmitted", (patient) => {
//   console.log(`System: Creating patient record for ${patient.name}.`);
// });

// monitor.on("criticalVitals", ({ patientId, vitals }) => {
//   console.log(
//     `ALERT: Patient ${patientId} has critical heart rate: ${vitals.heartRate}`,
//   );
// });

// monitor.admitPatient({ name: "James", id: 1 });
// monitor.recordVitals(1, { heartRate: 145, bloodPressure: "180/110" });
// monitor.admitPatient({ name: "James", id: 1 });
// monitor.admitPatient({ name: "James", id: 1 });
// monitor.admitPatient({ name: "James", id: 1 });

// To Remove Listeners
// .off('event', callback) OR .removeListener('event', callback)

// EXAMPLE 2

// class HospitalSystem extends EventEmmiter {
//   constructor() {
//     super();
//     this.appointments = [];
//   }

//   bookAppointment(appointment) {
//     this.appointments.push(appointment);
//     // announce an appointment was booked
//     this.emit("appointmentBooked", appointment);
//   }

//   cancelAppointment(appointmentId) {
//     const appointment = this.appointments.find((a) => a.id === appointmentId);
//     this.appointments = this.appointments.filter((a) => a.id !== appointmentId);

//     if (appointment) this.emit("appointmentCancelled", appointment);
//   }
// }

// const hospital = new HospitalSystem();

// // Listener 1: notify the patient
// hospital.on("appointmentBooked", (appointment) =>
//   console.log(`SMS sent to ${appointment.patientname}`),
// );

// // Listener 2: notify the doctor
// hospital.on("appointmentBooked", (appointment) =>
//   console.log(
//     `Calender upated for Dr. ${appointment.doctor}: New appointment on ${appointment.date}`,
//   ),
// );

// // Listener 3: log for audit
// hospital.on("appointmentBooked", (appointment) =>
//   console.log(
//     `Audit Log: Appointment #${appointment.id} booked at ${new Date().toISOString()}`,
//   ),
// );

// // Listener for cancellations
// hospital.on("appointmentCancelled", (appointment) =>
//   console.log(
//     `Cancellation processed for ${appointment.patientname}. Slot now available.`,
//   ),
// );

// //Now trigger the Events
// hospital.bookAppointment({
//   id: 1,
//   patientname: "James",
//   doctor: "Osei",
//   date: "2026-09-15 10:00",
// });

// hospital.bookAppointment({
//   id: 2,
//   patientname: "Desire",
//   doctor: "Osei",
//   date: "2026-09-15 12:00",
// });

// hospital.cancelAppointment(1);
