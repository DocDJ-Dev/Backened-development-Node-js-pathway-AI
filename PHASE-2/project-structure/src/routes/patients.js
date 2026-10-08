const express = require("express");
// express.Router() creates a mini Express app — a self-contained collection of routes that can be mounted onto a path in app.js
// This is exactly like  createRouter() but built into Express
const router = express.Router();
const pool = require("../db/pool");
const validateId = require("../middleware/validateId");
const authorize = require("../middleware/authorize");
const auth = require("../middleware/auth");
const asyncHandler = require("../utils/asyncHandler");
const { NotFoundError, ValidationError } = require("../utils/errors");
const validateBody = require("../middleware/validateBody");

// let patients = [
//   { id: 1, name: "Alice Mwangi", age: 34, diagnosis: "Hypertension" },
//   { id: 2, name: "James Mensah", age: 52, diagnosis: "Diabetes Type 2" },
//   { id: 3, name: "Carol Osei", age: 28, diagnosis: "Asthma" },
// ];
// let nextId = 4;

// GET
router.get(
  "/",
  auth,
  asyncHandler(async (req, res) => {
    let query = "SELECT * FROM patients WHERE 1=1";
    // 'WHERE 1=1' is a common trick — always true, lets us append.
    // additional AND conditions are appended to the query below without worrying about whether.
    // this is the FIRST condition (which wouldn't need AND) or not.

    const params = [];
    // temporary storage of actual condition.

    if (req.query.search) {
      params.push(`%${req.query.search}%`);
      // %...% builds the LIKE wildcard pattern
      // the value itself
      // is STILL passed as a parameter, never concatenated into the query text
      query += ` AND name ILIKE $${params.length}`;
      // $${params.length} dynamically builds '$1', '$2' etc. based on how many parameters
    }

    if (req.query.diagnosis) {
      params.push(`%${req.query.diagnosis}%`);
      query += ` AND diagnosis ILIKE $${params.length}`;
    }

    query += " ORDER BY patient_id";

    // Done building the query

    // Now borrowing a connection;
    const result = await pool.query(query, params);

    // res.json() = Content-Type header + JSON.stringify + res.end() in one call
    res.json({ count: result.rows.length, patients: result.rows });
  }),
);

// GET
router.get(
  "/:id",
  auth,
  validateId,
  asyncHandler(async (req, res) => {
    const result = await pool.query(
      "SELECT * FROM patients WHERE patient_id = $1",
      [req.patientId],
    );

    if (result.rows.length === 0) {
      throw new NotFoundError(`Patient with id ${req.patientId} not found`);
    }

    res.json(result.rows[0]);
  }),
);

// POST
// No async needed — express.json() already parsed req.body synchronously
router.post(
  "/",
  auth,
  authorize("doctor", "admin"),
  validateBody("name", "age", "diagnosis"),
  asyncHandler(async (req, res) => {
    const { name, age, diagnosis } = req.body;

    // Validation — if statements, not try/catch (expected conditions)
    // if (!name) {
    //   throw new ValidationError("name is required");
    // }

    if (typeof age !== "number" || age < 0 || age > 150) {
      throw new ValidationError("age must be a number between 0 and 150");
    }

    const result = await pool.query(
      "INSERT INTO patients (name, age, diagnosis) VALUES ($1, $2, $3) RETURNING *",
      [name, age, diagnosis || "Pending assessment"],
    );

    // RETURNING * tells PostgreSQL to send back the complete inserted row,
    // including the auto-generated patient_id

    res.status(201).json(result.rows[0]);
  }),
);

// PATCH
router.patch(
  "/:id",
  auth,
  authorize("doctor", "admin"),
  validateId,
  asyncHandler(async (req, res) => {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const existing = await client.query(
        "SELECT * FROM patients WHERE patient_id = $1 FOR UPDATE",
        [req.patientId],
      );

      if (existing.rows.length === 0) {
        throw new NotFoundError(`Patient with id ${req.patientId} not found`);
      }

      // Only these column names are ever allowed to be patched —
      // explained below why this allowlist matters for security
      const allowedFields = ["name", "age", "diagnosis"];

      const setClauses = [];
      const values = [];
      let paramIndex = 1;

      // Loop through the FIXED list of allowed fields, not req.body's keys directly
      for (const field of allowedFields) {
        if (req.body[field] !== undefined) {
          setClauses.push(`${field} = $${paramIndex}`);
          values.push(req.body[field]);
          paramIndex++;
        }
      }

      if (setClauses.length === 0) {
        throw new ValidationError("No valid fields provided to update");
      }

      if (req.body.age !== undefined) {
        if (
          typeof req.body.age !== "number" ||
          req.body.age < 0 ||
          req.body.age > 150
        ) {
          throw new ValidationError("age must be a number between 0 and 150");
        }
      }

      // patient_id for the WHERE clause is always the LAST parameter
      values.push(req.patientId);

      const query = `
        UPDATE patients
        SET ${setClauses.join(", ")}
        WHERE patient_id = $${paramIndex}
        RETURNING *
      `;

      const result = await client.query(query, values);

      await client.query("COMMIT");
      res.json(result.rows[0]);
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release;
    }
  }),
);

// DELETE
router.delete(
  "/:id",
  auth,
  authorize("admin"),
  validateId,
  asyncHandler(async (req, res) => {
    const result = await pool.query(
      "DELETE FROM patients WHERE patient_id = $1 RETURNING *",
      [req.patientId],
    );

    if (result.rows.length === 0) {
      throw new NotFoundError(`Patient with id ${req.patientId} not found`);
    }

    res.json({ message: "Patient deleted successfully", patient: deleted });
  }),
);

module.exports = router;
