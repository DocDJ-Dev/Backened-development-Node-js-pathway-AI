CREATE TABLE
    IF NOT EXISTS departments (department_id SERIAL PRIMARY KEY, name VARCHAR(100) NOT NULL);


CREATE TABLE
    IF NOT EXISTS doctors (doctor_id SERIAL PRIMARY KEY, name VARCHAR(100) NOT NULL, age INT, gender VARCHAR(20), specialty VARCHAR(100));


CREATE TABLE
    IF NOT EXISTS patients (patient_id SERIAL PRIMARY KEY, name VARCHAR(100) NOT NULL, age INT, national_id VARCHAR(50), address VARCHAR(255), gender VARCHAR(20));


CREATE TABLE
    IF NOT EXISTS appointments (appointment_id SERIAL PRIMARY KEY, doctor_id INT REFERENCES doctors (doctor_id), patient_id INT REFERENCES patients (patient_id), department_id INT REFERENCES departments (department_id), scheduled_at TIMESTAMP NOT NULL, STATUS VARCHAR(20) DEFAULT 'scheduled');