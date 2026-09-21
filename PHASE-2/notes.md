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
