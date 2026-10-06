## PostgreSQL Storage InternalsPostgreSQL Storage Internals

# pages, tuples, heap files, and the MVCC mechanism

#Pages — The Basic Unit of Storage
-PostgreSQL never reads or writes individual rows to disk directly
-it organizes every table into fixed-size chunks called pages — by default, exactly 8 KB (kilobytes) each.
-Every single read or write operation happens at the granularity of a whole page, never smaller.
Each page internally contains:
-Item pointers (small references saying "row data starts at this position")=> grow from the top of the page downwards.
-Actual Row Data (grows upward)
-They meet somewhere in the middle — once a page is full, PostgreSQL allocates a new page.

#Tuples — The Physical Representation of a Row
-A tuple is the physical, on-disk version of "row."
-extra hidden system columns:
1 ctid — the physical location of this exact tuple: (page_number, position_within_page) e.g SELECT ctid, patient_id, name FROM patients;
-(0,1) means "page 0, first slot in that page."
2 xmin — the ID of the transaction that created this tuple
3 xmax — the ID of the transaction that deleted/replaced this tuple (or 0 if it's still current)

#MVCC (Multi-Version Concurrency Control)
-PostgreSQL Never Updates In Place evidenced by change in ctid after updates.
-PostgreSQL uses a design called MVCC. ostgreSQL does NOT modify the existing bytes on disk. Instead, it:
1 Writes an entirely new tuple.
2 Marks the old tuple as dead by setting its xmax.
3 The old tuple still physically exists on disk
This is what allows multiple users to read and write the same table simultaneously without blocking each other constantly — a transaction
reading the table sees a consistent snapshot (the old tuple) while another transaction is mid-update, without either one having to wait.

Dead Tuples and Bloat — The Consequence
-table can bloat — grow far larger on disk than the actual live data would require.
-SELECT pg_size_pretty(pg_total_relation_size('patients'));
=> checks for the size e.g of a table.
pg_total_relation_size() returns the size in raw bytes.
pg_size_pretty() formats it as human-readable ("48 kB" etc.).

#VACUUM — Reclaiming Dead Space
-VACUUM is PostgreSQL's cleanup process.
-Scans a table, identifies dead tuples, clean and marks their space as reusable for future inserts/updates.
VACUUM VERBOSE patients;
-this is a query that reports exactly how many dead tuples it found and cleaned up manually.
-In production, PostgreSQL runs this automatically in the background via a process called autovacuum

#Heap Files — The Default Table Structure
-The term heap refers to how PostgreSQL stores table data by default: an unordered collection of pages.
-When you run SELECT FROM with no ORDER BY, the order send get back is essentially "whatever order the tuples happen to physically sit in" — which is why queries without ORDER BY can return different row orderings on different runs, especially after updates.

## Indexes — B-tree Internals

-This concept address the problem sequential scan (seq scan) — reading every single row, one by one, in physical order, until it's checked them all which is expensive in very large DB.
-An index is a separate data structure, stored alongside your table, that lets PostgreSQL find rows without checking every single one.
-The standard structure PostgreSQL uses by default is called a B-tree (Balanced Tree).
-structured as a tree with multiple levels:
[Root Node]
/ | \
 [Node A] [Node B] [Node C]
/ \ / \ / \
 [Leaf] [Leaf] [Leaf][Leaf][Leaf][Leaf]
-Each node contains sorted key values and pointers.
-Searching means starting at the root, comparing search value, and following the correct branch down.

#Creating an Index
-Naming convention: idx_tablename_columnname
e.g CREATE INDEX idx_patients_national_id ON patients(national_id);
-Important — primary keys already have an index automatically.

## EXPLAIN ANALYZE

-diagnostic tool
-It shows you PostgreSQL's actual execution plan for a query
1 Seq Scan on patients — confirms PostgreSQL scanned the whole table sequentially (no index used).
2 cost=0.00..1.06 — PostgreSQL's internal cost estimate (arbitrary units, useful for comparing plans against each other, not real time)
3 rows=1 — how many rows it expected to find
4 actual time=0.015..0.018 — the REAL measured time this took, in milliseconds (0.015ms to start producing results, 0.018ms to finish)
5 Rows Removed by Filter: 4 (it checked all 5 rows, discarded 4 non-matches)
6 Execution Time: 0.045 ms — total real execution time

#Query Planner-decides, for every query, whether using an index is actually faster than a sequential scan
-For a tiny table — 5 rows fitting in one 8KB page — reading the whole page sequentially is often faster than the overhead of consulting an index structure, jumping to a different location, and then still having to fetch the actual row.

Explain Analyse on index scanning;
1 Index Scan using idx_patients_national_id on patients
(cost=0.29..8.31 rows=1 width=68) (actual time=0.025..0.027 rows=1 loops=1)
2 Index Cond: (national_id = 'ZW-005000'::text)
3 Planning Time: 0.180 ms
4 Execution Time: 0.045 ms

Indexes help when:

1 frequently filter (WHERE), join (ON), or sort (ORDER BY) on that column.
2 The table is large enough that skipping rows genuinely saves work.
3 The column has high cardinality (many distinct values — like national_id, where almost every value is unique).

Indexes hurt when:

1 Every INSERT, UPDATE, or DELETE must also update every index on that table — more indexes means slower writes, since each one needs maintaining.
2 The column has low cardinality (e.g., a gender column with only 2-3 possible values) — an index here barely helps, since it can't eliminate much; the planner usually ignores such indexes and seq-scans anyway.
3 rarely or never query by that column — the index just costs write performance and disk space for no benefit

# Composite Indexes — Indexing Multiple Columns Together

-A composite index covers more than one column at once, and column order matters enormously.
-e.g CREATE INDEX idx_appointments_doctor_status ON appointments(doctor_id, status);
This index is effectively sorted first by doctor_id, then by status within each doctor.
-It efficiently serves:
1 -- Uses the index fully — matches both columns in order
WHERE doctor_id = 1 AND status = 'scheduled'
2 -- Still uses the index — just the first column
WHERE doctor_id = 1
-But it cannot efficiently serve:
-- Cannot use this index efficiently — status is not the FIRST column
WHERE status = 'scheduled'

# Partial Indexes — Indexing Only Some Rows

-A partial index only includes rows matching a condition — useful when frequently query a specific subset.
e.g CREATE INDEX idx_appointments_scheduled ON appointments(scheduled_at)
WHERE status = 'scheduled';
-only covers rows where status = 'scheduled', ignoring completed/cancelled ones
-This index is smaller and faster to maintain

## Bitmap Heap Scan

-another scanning in addition to seq and index.
-is a middle strategy, used when neither extreme is ideal.
-the more the number of rows matching, seq scan is favoured.
-the less, the more likely the index scan to occur
-somewhere in between, bitmap stays there. "medium amount of matches" zone is exactly where Bitmap scans take over.
#Why this is faster than plain Index Scan here:
-a regular Index Scan would mean thousands of separate random jumps to disk, one per matching row — expensive.
-Bitmap scan instead visits each relevant page once, in order, picking up every match on that page together.

## The Query Planner

-query planner (or optimizer) considers multiple possible ways to execute that same query.
1 Seq Scan vs Index Scan vs Bitmap Scan,
2 which table to join first, which join algorithm to use.
3 estimates the cost of each approach, and picks the cheapest one.

#Statistics — How The Planner Makes Decisions;
-how many rows a table has,
-how many distinct values a column has,
-the distribution of values along each column.
#To check status of a column:
SELECT \* FROM pg_stats WHERE tablename = 'patients' AND attname = 'gender';
These statistics aren't updated automatically in real time — they're refreshed by ANALYZE(run automatically by autovacuum)
ANALYZE is also runnable manually e.g;
ANALYZE patients;

-Statistics can go stale after large, rapid data changes, causing the planner to make bad decisions temporarily.
-stale stats after a bulk import is a common real cause of a query that was fast suddenly becoming; -ANALYZE genuinely practical troubleshooting.

# Forcing A Different Plan — For Learning, Never In Production

-PostgreSQL can temporarily disable certain scan types, purely to observe what the planner would have done otherwise and help in decision making.
e.g -- Temporarily tell the planner "don't use sequential scans if you can avoid it"
=>SET enable_seqscan = OFF;
=>SET enable_seqscan = ON; for turning back ON.

=>EXPLAIN SELECT \* FROM patients WHERE age < 40;

#Reading Cost Numbers Properly after EXPLAIN QUERY;
Seq Scan on patients (cost=0.00..1727.00 rows=50000 width=68)
-(0.00 — work before the first row can be returned) and total cost (1727.00 — work to return every row). These are arbitrary internal units for comparing plans against each other.
Only actual time= (which appears with EXPLAIN ANALYZE) reflects real elapsed time.

## Transactions and Locks

# ACID and transactions

-A transaction is a group of one or more SQL statements that PostgreSQL guarantees will either all succeed together, or all fail together.
-BEGIN=> starts a transaction.
-COMMIT=> makes every change inside it permanent.
-ROLLBACK — every single change since BEGIN is undone completely.
-A classic money-transfer example: if first UPDATE (withdraw $100) succeeds, but the second UPDATE (deposit $100) fails because of a typo or a crash, PostgreSQL guarantees that failure in the second statement automatically undoes the first one too.

ACID

-Atomicity: A transaction is treated as one indivisible unit — it cannot partially apply.

-Consistency: the database moves from one valid state to another valid state, never leaving data that violates defined rules (foreign keys, NOT NULL, etc.) even mid-transaction.If a transaction would create an orphaned foreign key or violate a constraint, PostgreSQL rejects it entirely rather than allowing a half-broken state to exist.

-Isolation: multiple transactions running at the same time don't interfere with each other's intermediate (uncommitted) state.

-Durability: once a transaction commits, the change is permanent, surviving even a server crash or power loss immediately afterward. PostgreSQL achieves this by writing changes to a durable log on disk (the WAL — Write-Ahead Log) before confirming the commit, so even if the server crashes a millisecond after COMMIT, the change can be recovered on restart.

#Solving The Double-Booking Problem — Properly, With a Transaction
-- SELECT ... FOR UPDATE locks this specific row for the duration of the transaction
-- Any OTHER transaction trying to touch this same row must wait until this one finishes
-- If that returned a row, it's genuinely free and now LOCKED for this specific transaction.

(BEGIN;

SELECT \* FROM appointments WHERE slot_id = 5 AND patient_id IS NULL FOR UPDATE;

UPDATE appointments SET patient_id = 42 WHERE slot_id = 5;

COMMIT;)

## Isolation Levels and Deadlocks

-Locking => one transaction blocking another on the same row.

#Read Anomalies Isolation has to solve:
-Dirty Read (reading data that was never actually committed)- session B read data that session has not yet committed or even rolled back; Dirty reads simply don't happen in PostgreSQL at any level of isolation: Internally solved.
-Non-Repeatable Read (the same row changes value mid-transaction)=> Session A reads a different values for the same column while still in the same transaction if B changes it while A hasnt committed yet.
-Phantom reads=> running the same WHERE query twice in one transaction and getting back a different set of rows the second time, because another transaction inserted new matching rows in between.

#LEVELS OF ISOLATION

1 READ UNCOMMITTED:
-lowest level by SQL standard
-PostgreSQL implements this identically to READ COMMITTED. (dirty reads never happen here regardless)
-permits dirty reads.

2 READ COMMITTED:
-PostgreSQL's default.
-Prevents dirty reads, but allows non-repeatable reads and phantom reads

3 REPEATABLE READ:
-prevents both dirty reads AND non-repeatable reads.
-PostgreSQL's MVCC gives a REPEATABLE READ transaction a consistent snapshot taken at the moment the transaction began, and every query inside that transaction keeps reading from that same frozen snapshot.
-the SQL standard technically still permits phantom reads at REPEATABLE READ, but PostgreSQL's actual implementation is stricter than the standard requires and prevents phantoms here too.

-- Syntax for starting a transaction at a specific level:
BEGIN TRANSACTION ISOLATION LEVEL REPEATABLE READ;

4 SERIALIZABLE
-the strictest level.
-Transactions behave as if they ran one at a time, in some sequential order, even though they're actually running concurrently.
-If PostgreSQL detects that, it aborts one of them with a serialization failure error; Application code is expected to catch this error and simply retry the whole transaction.

## Deadlocks:

=>A deadlock happens when Transaction A holds a lock Transaction B needs, while simultaneously B holds a lock A needs.
-neither can proceed, each is waiting on the other, forever, unless something intervenes.
-In PSQL, one of your two sessions will suddenly return an error instead of continuing to hang.
=> ERROR: deadlock detected...
-PostgreSQL runs a background deadlock detector that periodically checks.
-The moment it confirms a genuine cycle(the deadlock), it automatically picks one transaction as the "victim," forcibly rolls it back, and lets the other one proceed immediately.
-The actual fix lives the application design: always acquire locks on multiple rows in a consistent, predictable order (e.g locking the lower id first irregardless of operation to occur. Therefore session B will try to lock same as A has locked already before locking another row A might want)
