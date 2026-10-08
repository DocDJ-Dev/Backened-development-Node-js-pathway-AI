## pg library and connection pooling

-pg is the official, most widely-used PostgreSQL driver for Node.js
-the library that actually speaks PostgreSQL's wire protocol (the low-level format Postgres expects over a network connection)

-A connection pool create a fixed number of connections once and when server starts, it reuse them across many requests.
#Mechanisms:
1 Server starts
2 Pool creates 10 real connections to PostgreSQL, keeps them open.
3 Client request arrives and borrow 1 of the connection, perfoms a query and return the connection.
4 if connections are saturated, requests to use connections are queued and wait.

#Why "Pool" Instead Of A Single Connection
-A single database connection is expensive to create — it involves a TCP handshake (remember Topic 1), PostgreSQL authentication, and session setup.
-Doing this fresh for every single HTTP request would be disastrous for performance (making API dramatically slower under any real load.)
-if created a brand new Client connection per request and never reused it, under real traffic, PostgreSQL's own connection limit (default 100) rapidly exhaust.

Simple Queries
pool.query(...) automatically: borrows a connection from the pool, runs the query, returns the connection to the pool, and gives you back the result — all in one call, for simple non-transactional queries.

#Parameterized Queries($1 or $2)
-critical security concept.
-SQL injection — a malicious user crafting input that gets interpreted as SQL code instead of pure data

// NEVER DO THIS — vulnerable to SQL injection
[const name = req.body.name
await pool.query(`SELECT * FROM patients WHERE name = '${name}'`)]

The correct, safe way:
const name = req.body.name
const result = await pool.query('SELECT \* FROM patients WHERE name = $1', [name])

## Query builders/ORMs and migrations
