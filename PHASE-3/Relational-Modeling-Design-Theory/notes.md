## Relational Database

## Relational Modeling & Database Design Theory

-solves two problems at once:
1 data persistent
2 enforces structure so your data can't quietly become inconsistent.
3 linking multiple tables together correctly
-A relational database is a collection of tables, where:
#table — a named collection of similar things (e.g., patients).
#row (also called a record or tuple) is like one object in that array — one specific patient.
#column (also called a field or attribute) is like one property on that object — name, age, diagnosis

#Primary Keys — The Non-Negotiable Foundation.
-primary key (PK) is a column (or combination of columns) that uniquely identifies every row in a table.
-Rules for a good primary key:
*Must be unique for every row, forever
*Must never be null (empty/missing)
\*Should never change once set (don't use something like email as a primary key — emails change)

#Foreign Keys — How Tables Actually Link Together
-foreign key (FK) is a column in one table that holds the primary key value from another table — creating a link between them.
-This is the entire point of relational design: store each real-world fact exactly once, and link to it wherever it's needed, instead of copying it everywhere.

The Three Relationship Types — With Medical Examples

One-to-One (rare)
-Each row in Table A relates to exactly one row in Table B, and vice versa.
-Usually used to split a table for security or organizational reasons. Sensitive insurance data lives separately from general patient info, even though there's exactly one insurance record per patient.

One-to-Many (the most common relationship in every system)
-One row in Table A relates to MANY rows in Table B, but each row in Table B relates back to only ONE row in Table A.
-doctors (1) ←→ (many) appointments

Many-to-Many (needs a junction table)
-Many rows in Table A relate to many rows in Table B, and vice versa.
-patients (many) ←→ (many) doctors
-need a junction table (also called a join table or linking table) sitting between

Normalization — The Rules That Prevent Data Corruption
-ormal rules for organizing tables to eliminate duplication and prevent specific categories of data corruption called anomalies.
One Giant Flat Table:
1 Update anomaly- must update it in EVERY row.
2 Insert anomaly- can't add a new doctor to the system until they have at least one appointment.
3 Delete anomaly- loss of ALL information while deleting temporary data

Normalizing Step
1 1NF (First Normal Form)- every column holds a single, indivisible (atomic) value; no repeating groups.
2 2NF (Second Normal Form)- every non-key column must depend on the ENTIRE primary key, not just part of it.
3 3NF (Third Normal Form)- no column should depend on another non-key column (called a transitive dependency)

#Full ER (Entity-Relationship) Modeling Walkthrough
-ER (Entity-Relationship) diagram — a visual/textual way to plan database structure before writing any SQL

Step 1 — Identify the entities (things that become tables):
Step 2 — Identify attributes for each entity:
Step 3 — Identify relationships and cardinality (the "shape" of the relationship — 1:1, 1:N, M:N)
Step 4 — Written in ER notation
-|| means "exactly one," o{ means "zero or many". Crow's foot notation.
