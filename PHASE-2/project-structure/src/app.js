const express = require("express");
const dotenv = require("dotenv");

// Load .env file into process.env BEFORE anything else
// After this line, process.env.PORT and process.env.NODE_ENV are available
dotenv.config();

// Import routes
const patientsRouter = require("./routes/patients");
const vitalsRouter = require("./routes/vitals");

// Import middleware
const logger = require("./middleware/logger");
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");

const app = express();

// GLOBAL MIDDLEWARE
// These runs on every request, in the order registered

// Parse JSON bodies — must come before routes that use req.body
app.use(express.json());

// 2. Parse URL-encoded bodies — for HTML form submissions extended: false means use Node's built-in querystring parser
app.use(express.urlencoded({ extended: false }));

// 3. Logger — runs on every request
app.use(logger);

// ROUTES
// Mount routers at specific paths
// Every route inside patientsRouter is now prefixed with /api/patients
app.use("/api/patients", patientsRouter);

// Mount vitals router under patients — the :id param comes from patientsRouter
app.use("/api/patients/:id/vitals", vitalsRouter);

// FALLBACK MIDDLEWARE
// These must come AFTER all routes
// 404 — runs when no route matched
app.use(notFound);

// Error handler — runs when next(err) is called anywhere
// Must be LAST and must have 4 parameters (err, req, res, next)
app.use(errorHandler);

module.exports = app;
