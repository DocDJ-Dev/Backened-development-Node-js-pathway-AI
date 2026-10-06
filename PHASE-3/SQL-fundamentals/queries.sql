-- Basic SELECT/WHERE;
-- Get ALL doctors WITH specialty = 'Cardiology'
SELECT
    *
FROM
    patients;


-- Get ALL patients older than 30;
SELECT
    *
FROM
    patients
WHERE
    age > 30;


-- sorted by age descending
SELECT
    *
FROM
    patients
ORDER BY
    age DESC;


-- Get ALL appointments WITH STATUS = 'scheduled'
SELECT
    *
FROM
    appointments
WHERE
    STATUS = 'schedules';


-- Get the youngest 2 patients
SELECT
    *
FROM
    patients
ORDER BY
    age
LIMIT
    2;


-- Filtering
--    Find ALL patients whose name CONTAINS the letter 'a' ( -- CASE- insensitive)
SELECT
    *
FROM
    patients
WHERE
    ILIKE '%a%';


-- Find ALL appointments happening IN September 2026
SELECT
    * appointments
WHERE
    scheduled_at >= '2026-09-01' AND
    scheduled_at < '2026-10-01';


-- Find ALL patients where address IS NOT NULL
SELECT
    * patients
WHERE
    address IS NOT NULL;


-- Find ALL appointments WHERE STATUS IS either 'scheduled' OR 'cancelled' USING IN
SELECT
    *
FROM
    appointments
WHERE
    STATUS IN ('scheduled', 'cancelled');


-- INSERT/ UPDATE/ DELETE
-- INSERT a patient
INSERT INTO
    patients (name, age, national_id, address, gender)
VALUES
    ('Victor Rose', 44, 'ZW-005', 'male', 'General Medicine');


-- INSERT a new appointment
INSERT INTO
    appointments (doctor_id, patient_id, department_id, scheduled_at, status)
VALUES
    (2, 5, 3, '2026-09-26', 'scheduled');