-- psql doesnt update a row in place. it creates a new row and add to the table as a new tuple on same page or the even other page with space that time. the old tuple is marked as dead and will be wiped by the vacuum process and marked reusable. the whole process termed mvcc
-- the vitals table will not bloat because new tuples are being formed and not updating previous vital tuple hence no dead tuple
-- regularly updating the last vitals check at poses a problem of bloating due to accumulation of dead tuples. automatic vacumming will handle this.
-- Generate 10,000 fake patients to see real index behavior
-- INSERT INTO patients (name, age, national_id, address, gender)
-- SELECT 
--   'Patient ' || i,
--   (random() * 80 + 1)::int,
--   'ZW-' || LPAD(i::text, 6, '0'),
--   'Address ' || i,
--   CASE WHEN i % 2 = 0 THEN 'male' ELSE 'female' END
-- FROM generate_series(1, 10000) AS i;
EXPLAIN ANALYZE
SELECT
    *
FROM
    patients
WHERE
    national_id = 'ZW-005000';


-- creating index
CREATE INDEX idx_patients_national_id ON patients (national_id);


-- Low cardinality index behavior
-- Create an index on patients(gender) — a column with only 2 possible values
CREATE INDEX idx_patients_gender ON patients (gender);


EXPLAIN ANALYZE
SELECT
    *
FROM
    patients
WHERE
    gender = 'male';


-- Even with the index created, psql still uses seq scan on this case; This column of gender has low cardinality. The query planner usually ignores this type of index
DROP INDEX idx_name;


-- its not necessary to index gender type  column in real systems. The index here barely helps much and even the planner ignores it;
-- Composite index ordering;
-- Bulk up appointments so the planner has a real reason to consider an index
-- INSERT INTO appointments (doctor_id, patient_id, department_id, scheduled_at, status)
-- SELECT
--   (SELECT doctor_id FROM doctors ORDER BY random() LIMIT 1),
--   (SELECT patient_id FROM patients ORDER BY random() LIMIT 1),
--   (SELECT department_id FROM departments ORDER BY random() LIMIT 1),
--   NOW() - (random() * INTERVAL '365 days'),
--   (ARRAY['scheduled','completed','cancelled'])[floor(random()*3 + 1)]
-- FROM generate_series(1, 10000);
;


-- create the composite index
CREATE INDEX idx_appointments_doctor_status ON appointments (doctor_id, status);


-- Test 1: uses BOTH columns, in order — should use the index
EXPLAIN ANALYZE
SELECT
    *
FROM
    appointments
WHERE
    doctor_id = 1 AND
    status = 'scheduled' --execution time = 0.062ms; 
;


-- Test 2: uses only the FIRST column — should still use the index
EXPLAIN ANALYZE
SELECT
    *
FROM
    appointments
WHERE
    doctor_id = 1 --0.111ms ;
;


-- Test 3: uses only the SECOND column — should NOT use this index efficiently
EXPLAIN ANALYZE
SELECT
    *
FROM
    appointments
WHERE
    status = 'scheduled' -- 0.922 ;
;


-- Order matters. Its less efficient using the second index. For a phone book, it takes time to search for the second name before indexing with first name.
;


-- Partial index
CREATE INDEX idx_patients_age ON patients (age)
WHERE
    gender = 'male';


-- This SHOULD use the partial index — gender='male' matches the index's condition exactly
EXPLAIN ANALYZE
SELECT
    *
FROM
    patients
WHERE
    gender = 'male' AND
    age < 45;


-- the real design task (appointments by patient, most recent first):
CREATE INDEX idx_appointments_patient_scheduled ON appointments (patient_id, scheduled_at DESC);


EXPLAIN ANALYZE
SELECT
    *
FROM
    appointments
WHERE
    patient_id = 100
ORDER BY
    scheduled_at DESC
LIMIT
    10;


-- PostgreSQL B-tree indexes do support storing a column in descending order directly