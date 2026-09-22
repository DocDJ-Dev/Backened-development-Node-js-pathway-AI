## fundamentals of express framework

-Installation
-Initialisation
1 import
2 declare in a variable
3 call express func to read the body
4 create routes
5 call function to hand unmatched routes
6 start the server

200 plus plus lines of manually serving the client becomes 80 lines in express. Every line cleaner and more reliable and less error prone: Superpowers

## About app.use()

-its a middleware (function that runs before route handler, on every matching request).
1 Intercepts every incoming request before it reaches any route.
2 Reads the request body stream.
3 Parses it as JSON.
4 Attaches the result to req.body.
5 Calls next() internally — passing control to the next middleware or route handler.

#Express add extra properties and methods on top of raw Node req and res

## req in Express

1 req.params => extracted URL parameters
2 req.query => parsed query string
3 req.body => parsed request body
4 req.path => just the pathname
5 req.ip => client IP address
6 req.method => same as raw Node
7 req.headers => same as raw Node

## res in Express

1 res.json(data) => JSON.stringify + Content-Type + res.end() in one
2 res.status(404) // sets status code, returns res for chaining
3 res.status(404).json(data) // chain: status + json together
3 res.send(data) // sends any data, auto-detects content type
4 res.sendFile(path) // streams a file — replaces your static file server code
5 res.redirect(url) // sends a 301/302 redirect response

## Project Structure

1 app.js — creates and configures the Express app, exports it
2 server.js — imports the app and starts listening on a port
3 routes/ — each resource has its own file
4 middleware/ — reusable functions that run on every request

-Splitting app.js from server.js is architectural. -When Testing, test files will import app.js directly and run requests against it without starting a real server. If app.listen() was inside app.js, every test file import would try to bind a port and fail.

## Middleware

-signature=> (req, res, next)
-next = function called to pass control to the next middleware/route. If not called the request hangs foever

## Error Handling in Express

#consequenses of getting error handling wrong
1 server crushing (mostly due to async errors)
2 leaking important information or internal details to clients
3 failing silently and hiding of broken states or data in the system

#Centralising error handling in one middleware
1 consistence interms of format
2 reduce duplications
3 error handling is not missed in some routes

#Synchronous Errors
-automatically handled by express internals
-hence no server crushing

#Asynchronous errors
-no auto handling
-try/catch should be passed manually

#The next(err)
-for redirecting errors to one place ie the middleware
-all other middlewares in between are skipped

#The Async Wrapper Pattern
-Eliminate repetitive try/catch/next(err)
-its a middleware async handler that takes an async function ie the route handler
-no more need for try/catch inside route handler
-once an error is thrown, it automatically calls next(err)
-works fine with both sync and async errors

#Custome error classes

#The complete centralised error handler
-always log the full error

#Centralised Error Handler
-Log the FULL error server-side always
-custom errors already has statusCode and code
-unexpected error (a real bug), default to 500
-NEVER reveal internal error details for unexpected (non-operational) errors in production — this could leak sensitive implementation details
-Include stack trace ONLY in development — never in production

#Operational Errors vs Programmer Errors

Operational errors — expected failures (are not bugs). Examples:
1 A patient ID that doesn't exist (NotFoundError)
2 Invalid input from a client (ValidationError)
3 A database connection timing out
4 A third-party API being temporarily unavailable
5 A file that doesn't exist yet

Programmer errors — actual bugs. Something in your code is wrong:
1 Calling .toUpperCase() on undefined
2 A typo in a variable name causing ReferenceError
3 Passing the wrong number of arguments to a function
4 Logic errors — like the return positioned in the wrong place bugs you've fixed multiple times in this course
Continuing to run the application after a programmer error is dangerous — the safest thing is often to log it, alert someone, and restart the process cleanly.

isOperational: true on custom error classes error handler distinguish the two.

##The Last Line of Defense — Process-Level Error Handlers
-errors thrown outside of any Express request cycle need to be caught at the process level.
-they exit instead of trying to keep running: error may not be safe about application's state or data
-pair this with a process manager: brief restart is invisible to users
