CREATE TABLE
    vitals (vital_id SERIAL PRIMARY KEY, patient_id INT NOT NULL REFERENCES patients (patient_id) ON DELETE CASCADE, heart_rate INT NOT NULL, blood_pressure VARCHAR(20) NOT NULL, oxygen_level INT NOT NULL, alert_level VARCHAR(20) NOT NULL, recorded_at TIMESTAMP NOT NULL DEFAULT NOW ());


CREATE INDEX idx_vitals_patient_recorded ON vitals (patient_id, recorded_at DESC);