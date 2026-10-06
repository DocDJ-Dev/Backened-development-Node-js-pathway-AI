-- Count the total number of departments
SELECT
    COUNT(*) AS total_departments
FROM
    departments;


-- average, minimum, and maximum patient age
SELECT
    AVG(age) AS Average,
    MIN(age) AS Minimum_age,
    MAX(age) AS Maximum_age
FROM
    patients;


-- Count how many appointments have status = 'completed'
SELECT
    COUNT(*)
FROM
    appointments
WHERE
    status = 'completed';


-- Count how many DISTINCT patients have ever had an appointment
SELECT
    COUNT(DISTINCT patients.patient_id)
FROM
    patients
    INNER JOIN appointments ON appointments.patient_id = patients.patient_id;


-- For each department, count how many appointments have been scheduled there
SELECT
    departments.name AS department_name,
    COUNT(*)
FROM
    departments
    INNER JOIN appointments ON departments.department_id = appointments.department_id
GROUP BY
    departments.department_id;


-- For each patient, count how many appointments they have — include patients with zero
SELECT
    p.patient_id,
    COUNT(a.patient_id)
FROM
    patients p
    LEFT JOIN appointments a ON p.patient_id = a.patient_id
GROUP BY
    p.patient_id;


-- for each doctor, find the EARLIEST (MIN) and LATEST (MAX) scheduled_at among their appointments
SELECT
    d.name,
    MIN(a.scheduled_at),
    MAX(a.scheduled_at)
FROM
    doctors d
    LEFT JOIN appointments a ON d.doctor_id = a.doctor_id
GROUP BY
    d.doctor_id;


--  Find all doctors who have MORE than 1 appointment using HAVING   --
SELECT
    d.name
FROM
    doctors d
    INNER JOIN appointments a ON d.doctor_id = a.doctor_id
GROUP BY
    d.name
HAVING
    COUNT(a.doctor_id) > 0;


--  Find all patients whose age is below the average patient age, using a subquery   --
SELECT
    *
FROM
    patients a
WHERE
    age > (
        SELECT
            AVG(age)
        FROM
            patients
    );


-- Find all appointments in the same department as Alice Mwangi's first appointment
SELECT
    *
FROM
    appointments a
WHERE
    a.department_id = (
        SELECT
            MIN(appointment_id)
        FROM
            (
                SELECT
                    *
                FROM
                    appointments a
                    INNER JOIN patients p ON p.patient_id = a.patient_id
                WHERE
                    p.name = 'Alice Mwangi'
            )
    );