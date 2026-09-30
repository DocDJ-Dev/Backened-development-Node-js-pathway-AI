// Medication adherence + symptom tracker:

// Medications, Prescriptions, Dose logs (recording when a dose was actually taken), Symptom reports

// medications table:
// med_id | name | quantity

// medications to prescription (1:N)
// prescription table:
// prescrip_id(PK)  | patient_id(FK) | doctor_id(FK) | med_id(FK) | dosage | date | description

// Symptoms table
// symptom_id(PK) | name

// symptom_reports: report_id(PK) | patient_id(FK) | symptom_id(FK) |  reported_at | severity | notes

// dose_logs: (log_id(PK) | prescription_id(FK) | taken_at | was_taken(boolean));
