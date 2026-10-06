DROP TABLE IF EXISTS doctors,
patients,
departments,
appointments;


CREATE TABLE
    departments (department_id SERIAL PRIMARY KEY, name VARCHAR(100) NOT NULL);


CREATE TABLE
    doctors (doctor_id SERIAL PRIMARY KEY, name VARCHAR(100) NOT NULL, age INT, gender VARCHAR(20), specialty VARCHAR(100));


CREATE TABLE
    patients (patient_id SERIAL PRIMARY KEY, name VARCHAR(100) NOT NULL, age INT, national_id VARCHAR(50), address VARCHAR(255), gender VARCHAR(20));


CREATE TABLE
    appointments (appointment_id SERIAL PRIMARY KEY, doctor_id INT REFERENCES doctors (doctor_id), patient_id INT REFERENCES patients (patient_id), department_id INT REFERENCES departments (department_id), scheduled_at TIMESTAMP NOT NULL, STATUS VARCHAR(20) DEFAULT 'scheduled');


INSERT INTO
    departments (name)
VALUES
    ('Cardiology'),
    ('Endocrinology'),
    ('General Medicine');


INSERT INTO
    doctors (name, age, gender, specialty)
VALUES
    ('Dr. Ndleve', 45, 'male', 'Cardiology'),
    ('Dr. James', 38, 'female', 'Endocrinology'),
    ('Dr. Desire', 52, 'female', 'General Medicine');


INSERT INTO
    patients (name, age, national_id, address, gender)
VALUES
    ('Alice Mwangi', 34, 'ZW-001', '12 Samora Machel Ave, Harare', 'female'),
    ('James Mensah', 52, 'ZW-002', '45 Josiah Tongogara St, Harare', 'male'),
    ('Carol Osei', 28, 'ZW-003', '8 Robert Mugabe Rd, Harare', 'female');


INSERT INTO
    appointments (doctor_id, patient_id, department_id, scheduled_at, STATUS)
VALUES
    (1, 1, 1, '2026-09-15 10:00:00', 'scheduled'),
    (1, 2, 1, '2026-09-15 11:00:00', 'completed'),
    (2, 3, 2, '2026-09-16 09:30:00', 'scheduled'),
    (3, 1, 3, '2026-09-20 14:00:00', 'cancelled');


-- Notice something important: IN the appointments INSERT, doctor_id = 1 refers TO Dr. Ndleve — because he was the FIRST ROW inserted INTO doctors, so SERIAL gave him doctor_id = 1 automatically.