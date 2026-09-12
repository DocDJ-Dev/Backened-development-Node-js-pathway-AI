const express = require("express");
const app = express();

// this line automatically replaces readBody() function
// It automatically reads the request body stream, parses JSON
// and attaches the result to req.body - for every request

app.use(express.json());

// In memory data
const patients = [
  { id: 1, name: "Alice Mwangi", age: 34, diagnosis: "Hypertension" },
  { id: 2, name: "James Mensah", age: 52, diagnosis: "Diabetes Type 2" },
  { id: 3, name: "Carol Osei", age: 28, diagnosis: "Asthma" },
];

// ROUTES

//// GET
app.get("/api/patients", (req, res) => {
  // req.query is automatically parsed — no Object.fromEntries() needed
  let result = [...patients];

  if (req.query.search) {
    result = result.filter((p) =>
      p.name.toLowerCase().includes(req.query.search.toLowerCase()),
    );
  }

  // res.json() replaces entire sendJSON() helper
  // It automatically sets Content-Type: application/json
  // and calls JSON.stringify() and res.end()
  res.send(200).res.json({ count: result.length, patients: result });
});

// GET by id

app.get("/api/patients/:id", (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    // res.status() sets the status code
    // .json() sends the body
    // They chain — res.status(400).json({...}) is one expression
    return res.status(400).json({
      error: "Patient ID must be a number",
      code: "INVALID_ID",
    });
  }

  const patient = patients.find((p) => p.id === id);

  if (!patient) {
    return res.status(404).json({
      error: `Patient ${id} not found`,
      code: "NOT_FOUND",
    });
  }

  res.json(patient);
});
// //POST

app.post("/api/patients", (req, res) => {
  const { name, age, diagnosis } = req.body;

  if (!name)
    return res
      .status(400)
      .json({ error: "name is required", code: "VALIDATION_ERROR" });

  if (!age || typeof age !== "number" || age < 0 || age > 150)
    return res.status(400).json({
      error: "age must be a number between 0 and 150",
      code: "VALIDATION_ERROR",
    });

  const ids = patients.map((p) => p.id);
  const newId = Math.max(0, ...ids) + 1;

  const newPatient = {
    id: newId,
    name,
    age,
    diagnosis: diagnosis || "Pending assessment",
  };

  patients.push(newPatient);
  res.status(201).json(newPatient);
});

// //PATCH

app.patch("/api/patients/:id", (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res
      .status(400)
      .json({ error: "ID must be a number", code: "INVALID_ID" });
  }

  const index = patients.findIndex((p) => p.id === id);

  if (index === -1) {
    return res
      .status(404)
      .json({ error: `Patient ${id} not found`, code: "NOT_FOUND" });
  }

  if (req.body.age !== undefined) {
    if (
      typeof req.body.age !== "number" ||
      req.body.age < 0 ||
      req.body.age > 150
    ) {
      return res.status(400).json({
        error: "age must be a number between 0 and 150",
        code: "VALIDATION_ERROR",
      });
    }
  }

  patients[index] = { ...patients[index], ...req.body, id };
  res.json(patients[index]);
});

// //DELETE
app.delete(
  app.delete("/api/patients/:id", (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res
        .status(400)
        .json({ error: "ID must be a number", code: "INVALID_ID" });
    }

    const index = patients.findIndex((p) => p.id === id);

    if (index === -1) {
      return res
        .status(404)
        .json({ error: `Patient ${id} not found`, code: "NOT_FOUND" });
    }

    const deleted = patients.splice(index, 1)[0];
    res.json({ message: "Patient deleted", patient: deleted });
  }),
);
// 404 Catch-All
// must be registed last. unmatched routes reaches here
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    method: req.method,
    path: req.path,
  });
});

//========== START SERVER ========
app.listen(3000, () => console.log("listening at port 3000"));
