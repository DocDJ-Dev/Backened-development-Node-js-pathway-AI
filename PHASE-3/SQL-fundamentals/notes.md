## SQL Fundamentals

-SQL (Structured Query Language)=> is a declarative language(describe what result expected)
-loop in SQL; Its like give me all patients over 30" and the database figures out how to find them.

##CREATE TABLE
-Turning Your Schema Into Reality
#keywords
-SERIAL=> a PostgreSQL type meaning "auto-incrementing integer". Guarantees it, safely, even with many simultaneous users.
-PRIMARY KEY=> tells PostgreSQL this column uniquely identifies each row.
-VARCHAR(100)=> Variable Character; text field with a maximum length of 100 characters. PostgreSQL enforces this — inserting 101 characters throws an error.
-NOT NULL => this column can never be left empty — inserting a row without it fails.
-REFERENCES=> declare a foreign key in SQL. PostgreSQL will reject any attempt to insert an appointment pointing to a doctor that doesn't exist.
-TIMESTAMP — a date + time value
-DEFAULT 'scheduled' — if no value is given for status on insert, PostgreSQL fills in 'scheduled' automatically

##READ DATA- SELECT
--Get everything from a table(asterisk); use sparingly in real code, explicit column names are better practice
-- Get specific columns only(SELECT name, age FROM patients;)
-- SELECT with an alias — renaming a column in the output (SELECT name AS patient_name, age FROM patients)

##WHERE — Filtering
-- Exact match(SELECT \* FROM patients WHERE age = 34;)
-- Comparison operators(SELECT \* FROM patients WHERE age > 30;
or SELECT \* FROM patients WHERE age >= 30 AND age <= 50;)
-- Text matching — LIKE with % as a wildcard (matches any characters)
SELECT \* FROM patients WHERE name LIKE 'A%';
-- Finds any name STARTING with 'A' — Alice matches, James doesn't
-SELECT \* FROM patients WHERE name LIKE '%osei%';
-this is case-sensitive by default. Use ILIKE for case-insensitive matching:
-SELECT \* FROM patients WHERE name ILIKE '%osei%';
-Finds 'Carol Osei' regardless of capitalizations
-- Multiple conditions
SELECT \* FROM appointments WHERE status = 'scheduled' AND department*id = 1;
-- IN — matches any value in a list (cleaner than many OR conditions)
SELECT \* FROM appointments WHERE status IN ('scheduled', 'completed');
-- NULL checking — never use = for this, NULL is special
SELECT * FROM patients WHERE address IS NULL:
SELECT \* FROM patients WHERE address IS NOT NULL;
-IS NULL instead of = NULL; NULL means "unknown value" — and comparing anything to "unknown" with = always produces "unknown" (neither true nor false)

##ORDER BY and LIMIT
-- Sort ascending (default)
SELECT \* FROM patients ORDER BY age;
-- Sort by multiple columns
SELECT \* FROM appointments ORDER BY department_id, scheduled_at;
-- LIMIT — restrict how many rows come back (foundation of pagination)
SELECT \* FROM patients ORDER BY age DESC LIMIT 2;
-- OFFSET — skip a number of rows, used together with LIMIT for real pagination
SELECT \* FROM patients ORDER BY patient_id LIMIT 2 OFFSET 2;
Skip first 2, then take next 2 — this is page 2 of a 2-per-page list

##UPDATE and DELETE
-- UPDATE always needs WHERE, or it updates EVERY row
UPDATE appointments SET status = 'completed' WHERE appointment_id = 1;
-- Update multiple columns at once
UPDATE patients SET age = 35, address = '20 New Address St' WHERE patient_id = 1;
-- DELETE also always needs WHERE
DELETE FROM appointments WHERE appointment_id = 4;

## JOINs — All Four Types

-normalization: stop storing names as text in every row, and start storing just the number 1, which points to the doctors table.
-A JOIN is how to get the names back. It temporarily combines rows from multiple tables, matching them up by their related columns, so one unified result is produced.

# INNER JOIN — The Default, Most Common Type

-walks through every row in the first table. For each row, it looks in the second table for any row where the join condition matches. If it finds a match, it glues the two rows together into one wide row. If it finds no match, that row from the first table disappears entirely from the result.
e.g
SELECT appointments.appointment_id, patients.name, appointments.scheduled_at FROM appointments INNER JOIN patients ON appointments.patient_id = patients.patient_id;
SELECT appointments.appointment_id, patients.name AS patient_name, doctors.name AS doctor_name, appointments.scheduled_at, appointments.status FROM appointments INNER JOIN patients ON appointments.patient_id = patients.patient_id INNER JOIN doctors ON appointments.doctor_id = doctors.doctor_id ORDER BY appointments.scheduled_at;

#Table Aliases — Making Long Queries Readable
-AS a, AS p, AS d — now a, p, d stand in for the full table names everywhere in the query. This is standard practice in every real codebase.
-eg SELECT a.appointment_id, p.name AS patient_name, d.name AS doctor_name, a.scheduled_at FROM appointments AS a INNER JOIN patients AS p ON a.patient_id = p.patient_id INNER JOIN doctors AS d ON a.doctor_id = d.doctor_id;

#Data with no match
-INNER JOIN only shows rows where a match exists on BOTH sides.
-A doctor with no appointments has nothing to match against in the appointments table, so he's silently excluded.
-INNER JOIN: it can hide data that genuinely exists.
-If your API needs to show "all doctors, including ones with zero appointments today," INNER JOIN is the wrong tool — which is exactly what LEFT JOIN fixes.

# LEFT JOIN — Keep Everything From The First Table

-also called LEFT OUTER JOIN
-every row from the left (first) table appears in the result no matter what — even if no match was found. When there's no match, PostgreSQL fills in the right-side columns with NULL.
-The table named first, immediately before LEFT JOIN, is the "left" table.
-"Left" and "right" refer to their position in the SQL statement, not anything about position on screen.
e.g
SELECT d.name AS doctor_name, a.appointment_id, a.scheduled_at
FROM doctors AS d
LEFT JOIN appointments AS a ON d.doctor_id = a.doctor_id
ORDER BY d.doctor_id;
-the "left" table — doctors in this case.

# RIGHT JOIN

-RIGHT JOIN keeps every row from the second (right) table, filling the left side with NULL when there's no match.
-any RIGHT JOIN can be rewritten as a LEFT JOIN by swapping which table comes first.
SELECT d.name AS doctor_name, a.appointment_id
FROM appointments AS a
RIGHT JOIN doctors AS d ON a.doctor_id = d.doctor_id;

# FULL JOIN — Keep Everything From Both Sides

-FULL JOIN (also called FULL OUTER JOIN) combines LEFT and RIGHT JOIN behavior: every row from BOTH tables appears, with NULL filled in on whichever side has no match.
-This is genuinely rare in everyday backend work
e.g
SELECT d.name AS doctor_name, p.name AS patient_name
FROM doctors AS d
FULL JOIN appointments AS a ON d.doctor_id = a.doctor_id
FULL JOIN patients AS p ON a.patient_id = p.patient_id;

#The Dangerous Bug — Forgetting the ON Clause
-This produces a CROSS JOIN (Cartesian product).
-every single row in doctors gets paired with every single row in appointments, regardless of any relationship
-With 4 doctors and 4 appointments, that's 16 rows of mostly nonsensical combinations
-with real tables of thousands of rows each, a forgotten ON clause can produce millions of garbage rows and grind your database to a halt.

# Aggregations and Subqueries

-Every query so far has returned one output row per matching input row.- a JOIN between 4 appointments and 4 patients gave 4 rows back.
-Aggregation is different: it takes MANY rows and collapses them down into fewer summary rows — answering questions like "how many," "what's the total," "what's the average."

#The Aggregate Functions
COUNT(column) -- how many non-NULL values
SUM(column) -- adds up numeric values
AVG(column) -- average of numeric values
MIN(column) -- smallest value
MAX(column) -- largest value

#COUNT(\*) vs COUNT(column)
-SELECT COUNT(\*) FROM patients; Counts every row, regardless of NULLs anywhere.
-SELECT COUNT(address) FROM patients; Counts only rows where address is not NULL.

#AVG(column) -- average of numeric values
SELECT AVG(age) FROM patients;

#MIN(column) -- smallest value
SELECT MIN(age) FROM patients;
#MAX(column) -- largest value
SELECT MAX(age) FROM patients;
combined: SELECT MIN(age), MAX(age) FROM patients;

# GROUP BY

#The Core Idea- takes a table and splits it into buckets based on a column's value — then runs the aggregate function separately, once per bucket, instead of once across the whole table.
e.g SELECT doctor_id, COUNT(\*) FROM appointments GROUP BY doctor_id;
Find all DISTINCT values in doctor_id, and create one "bucket" per value: Run COUNT(\*) SEPARATELY on each bucket: Output ONE ROW PER BUCKET.
-Critical rule:
=>every column in SELECT list must either be
(a) the column(s) you grouped by, or
(b) wrapped in an aggregate function.

#Grouping With a JOIN
SELECT d.name AS doctor_name, COUNT(a.appointment_id) AS total_appointments FROM doctors d LEFT JOIN appointments a ON d.doctor_id = a.doctor_id GROUP BY d.name ORDER BY total_appointments DESC;

# HAVING — Filtering AFTER Aggregation

-WHERE filters rows before any grouping happens.
-HAVING filters groups after aggregation.
-- WRONG — WHERE cannot reference an aggregate function
SELECT d.name, COUNT(a.appointment_id) AS total FROM doctors d LEFT JOIN appointments a ON d.doctor_id = a.doctor_id GROUP BY d.name WHERE total > 1;
-- CORRECT — HAVING runs after grouping, can reference the aggregate
SELECT d.name, COUNT(a.appointment_id) AS total FROM doctors d LEFT JOIN appointments a ON d.doctor_id = a.doctor_id GROUP BY d.name HAVING COUNT(a.appointment_id) > 1;

# The execution order;

1. FROM / JOIN — gather and combine the raw rows
2. WHERE — filter individual rows (before grouping)
3. GROUP BY — split into buckets
4. HAVING — filter entire buckets (after aggregation)
5. SELECT — choose which columns to actually show
6. ORDER BY — sort the final result
7. LIMIT — cut down to N rows

# Subqueries — Queries Inside Queries

-A subquery is a complete SELECT statement nested inside another query, used to compute an intermediate value that the outer query then uses.
#Subquery Returning a Single Value — Used With Comparison Operators:
e.g -- Find all patients older than the average patient age
SELECT name, age FROM patients WHERE age > (SELECT AVG(age) FROM patients);
-PostgreSQL first runs the inner query (SELECT AVG(age) FROM patients). The inner query runs first, produces a value, and the outer query uses that value.

#Subquery Returning Multiple Values — Used With IN
SELECT \* FROM appointments WHERE department_id = ( SELECT department_id FROM departments WHERE name = 'Cardiology');
-inner query runs first → finds department_id = 1 for Cardiology → outer query becomes effectively WHERE department_id = 1.

#Subquery in the FROM Clause — Treating a Query Result as a Table
e.g -- Find doctors who have more than 1 appointment, using a subquery as a "virtual table"
SELECT \* FROM (SELECT d.name, COUNT(a.appointment_id) AS total FROM doctors d LEFT JOIN appointments a ON d.doctor_id = a.doctor_id GROUP BY d.name) WHERE total > 1;
-However, HAVING is more idiomatic (the standard, expected way) for this specific case

#EXISTS — Checking If Any Matching Row Exists At All.
e.g -- Find all doctors who have AT LEAST ONE appointment:
SELECT \* FROM doctors d WHERE EXISTS ( SELECT 1 FROM appointments a WHERE a.doctor_id = d.doctor_id );
-PostgreSQL runs the inner query checking "does any appointment exist with this doctor's id?"
-EXISTS only cares whether the inner query returns any rows at all, not what the rows actually contain (that's why SELECT 1 is conventional here — the 1 is a meaningless placeholder, since only existence matters, not the actual value returned).
