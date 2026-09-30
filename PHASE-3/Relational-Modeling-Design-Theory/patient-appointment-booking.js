// Patient/appointment booking (EHR-lite):
// (Patients, Doctors, Appointments, Departments);

// patients table:
// patient_id(PK) | name | age | national_id | address | gender

// Doctors table:
// doctor_id(PK) | name | age | gender | specialty

// Department table:
// department_id(PK) | name |

// doctor to department
// doctor_department_id | doctor_id | department_id

//  appontments to patients,  appointments to doctors , appointment to department , all are 1:N.
// Appointments table:
// appointment_id(PK) | doctor_id(FK) | patient_id(FK) | department_id(FK) | scheduled_at | status
