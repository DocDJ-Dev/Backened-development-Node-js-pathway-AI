## Migrations

-schema drift =>the real database structure slowly diverging from what the code expects.
-A migration is a small, versioned, run-once script that moves database structure from one state to the next.
-Migrations live in your repo as files, they run in a fixed order, and the database keeps a record of which ones it has already applied.
-Each migration has two halves:
=>Up: applies the change (add a column, create a table)
=>Down: reverses it
-The idea is that the database's structure becomes code, tracked and reproducible like everything else in the repo.

# Building a Migration Runner From Scratch

Step 1: create the folder and files at project root (migrations/
001_add_diagnosis_to_patients.up.sql
001_add_diagnosis_to_patients.down.sql
002_create_vitals_table.up.sql
002_create_vitals_table.down.sql)
Step 2: the runner.(src/db/migrate.js)

#Important:
-ON DELETE CASCADE means that when a patient row is deleted, PostgreSQL automatically deletes that patient's vitals rows too, instead of rejecting the delete.
-For real medical records, RESTRICT (block the delete) or a soft-delete approach, since clinical history usually must not vanish.

#Why each migration is wrapped in BEGIN/COMMIT:
-PostgreSQL supports transactional DDL (DDL means Data Definition Language, the SQL that changes structure: CREATE, ALTER, DROP).
-If a migration has three statements and the third fails, the first two are undone too.

# The Four Rules of Migrations

1. Never edit a migration that has already been applied. Database won't re-run it, because it's recorded as done. Fresh database will run the new version.Now the two databases differ and the runner can't see it, which is exactly the schema drift migrations exist to prevent. The correct move is always a new migration
2. Keep each migration small and single-purpose. One concern per file makes failures easy to locate and reverse.
3. A down migration can't always truly undo. DROP COLUMN diagnosis removes the column, but the data that was in it is gone permanently. In production, rolling back is often done with a new forward migration instead of running a down script, because down scripts can destroy real data.
4. Commit migrations to Git together with the code that needs them. The commit that adds diagnosis to route code should also contain the migration that adds the column. For medical systems this has a further benefit: Git history becomes a trustworthy record of how patient data structure changed over time.
