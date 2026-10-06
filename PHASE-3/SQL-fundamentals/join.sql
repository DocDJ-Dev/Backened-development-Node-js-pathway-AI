-- INNER JOIN
SELECT
    appointments.appointment_id,
    doctors.name,
    appointments.scheduled_at
FROM
    appointments
    INNER JOIN doctors ON appointments.appointment_id = doctors.doctor_id;


SELECT
    patients.name AS patient_name,
    departments.name AS department_name,
    appointments.status
FROM
    appointments
    INNER JOIN patients ON appointments.patient_id = patients.patient_id
    INNER JOIN departments ON appointments.department_id = departments.department_id;


-- LEFT JOIN
SELECT
    *
FROM
    patients
    LEFT JOIN appointments ON patients.patient_id = appointments.patient_id;


SELECT
    *
FROM
    departments
    LEFT JOIN appointments ON departments.department_id = appointments.department_id;


SELECT
    d.name,
    COUNT(a.appointment_id)
FROM
    doctors AS d
    LEFT JOIN appointments AS a ON d.doctor_id = a.doctor_id
GROUP BY
    d.name;


-- Miscelleneous
SELECT
    p.name AS patient_name,
    d.name AS doctor_name,
    d.specialty,
    dp.name AS department,
    a.appointment_id,
    a.scheduled_at,
    a.status
FROM
    patients p
    INNER JOIN appointments a ON p.patient_id = a.patient_id
    INNER JOIN doctors d ON d.doctor_id = a.doctor_id
    INNER JOIN departments dp ON dp.department_id = a.department_id
WHERE
    p.name = 'Alice Mwangi'
ORDER BY
    a.scheduled_at;


SELECT
    p.name AS patient_name
FROM
    patients p
    LEFT JOIN appointments a ON p.patient_id = a.patient_id
WHERE
    a.appointment_id IS NULL;