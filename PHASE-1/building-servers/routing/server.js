const http = require("http");
const { createRouter } = require("./router-from-scratch");

const router = createRouter();

const patients = [
  { id: 1, name: "Desire", age: 23, diagnosis: "DM" },
  { id: 2, name: "James", age: 45, diagnosis: "Asthma" },
  { id: 3, name: "Ndleve", age: 78, diagnosis: "Hypertension" },
];

// Helper: read JSON body from request
function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";

    req.on("data", (chunk) => (body += chunk.toString()));
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(new Error("Invalid JSON body"));
      }
    });
    req.on("error", reject);
  });
}

// Helper: send JSON response
function sendJSON(res, statusCode, data) {
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data, null, 2));
}

// // ROUTES

// // GET /patients - return all patients
router.get("/patients", (req, res) => {
  const diagnosisFilter = req.query.diagnosis;
  const result = diagnosisFilter
    ? patients.filter((p) =>
        p.diagnosis.toLowerCase().includes(diagnosisFilter.toLowerCase()),
      )
    : patients;
  sendJSON(res, 200, result);
});

// GET /patients/:id - return one patient
router.get("/patients/:id", (req, res) => {
  //req.params.id is always a string- convert to number
  const id = parseInt(req.params.id);

  if (isNaN(id))
    return sendJSON(res, 400, { error: "Patient ID must be a number" });

  const patient = patients.find((p) => p.id === id);

  if (!patient) return sendJSON(res, 404, { error: "Patient not found" });

  sendJSON(res, 200, patient);
});

// POST /patients - create new patient
router.post("/patients", async (req, res) => {
  try {
    const body = await readBody(req);

    // Validation
    if (!body.name || !body.age) {
      return sendJSON(res, 400, {
        error: "Validation Failed",
        required: ["name", "age"],
        received: Object.keys(body),
      });
    }

    const ids = patients.map((p) => p.id);
    const newId = Math.max(0, ...ids) + 1;

    const newPatient = {
      id: newId,
      name: body.name,
      age: body.age,
      diagnosis: body.diagnosis,
    };

    patients.push(newPatient);
    sendJSON(res, 201, newPatient);
  } catch (err) {
    sendJSON(res, 400, { error: err.message });
  }
});

// DELETE /patients/:id - remove a patient

router.delete("/patients/:id", (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id))
    return sendJSON(res, 400, { error: "Patient ID must be a number" });

  const index = patients.findIndex((p) => p.id === id);

  if (index === -1) {
    sendJSON(res, 404, { error: "Patient not found" });
  }

  const deleted = patients.splice(index, 1)[0];
  sendJSON(res, 200, { message: "Patient deleted", patient: deleted });
});

// SERVER

const server = http.createServer((req, res) => {
  // log every request
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);

  //   Delegate to router
  router.handle(req, res);
});

server.listen(8000, () => console.log("listening on port 8000"));
