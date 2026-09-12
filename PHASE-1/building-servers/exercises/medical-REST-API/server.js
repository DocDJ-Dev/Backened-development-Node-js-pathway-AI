const http = require("http");
const { createRouter } = require("./router");
const { sendResponse, readBody, readFile, writeFile } = require("./helpers");
const router = createRouter();
const path = require("path");

const patientsPath = path.join(__dirname, "patients.json");

// ROUTES FOR PATIENTS

router.get("/api/patients", async (req, res) => {
  const patients = await readFile(patientsPath);

  if (patients === "None") {
    sendResponse(req, res, 404, { error: "No Patients Found" });
    return;
  }

  if (!patients) {
    sendResponse(req, res, 400, {
      error: "Something went wrong reading patients",
    });
    return;
  }

  sendResponse(req, res, 200, patients);
});

router.get("/api/patients/:id", async (req, res) => {
  try {
    const patients = await readFile(patientsPath);

    if (patients === "None") {
      sendResponse(req, res, 404, { error: "No Patients Found" });
      return;
    }

    if (!patients) {
      sendResponse(req, res, 400, {
        error: "Something went wrong reading patients",
      });
      return;
    }

    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      sendResponse(req, res, 400, { error: "id must be a number" });
      return;
    }

    const patient = patients.patients.find((p) => p.id === id);

    if (!patient) {
      sendResponse(req, res, 404, { error: "Patient could not be found" });
      return;
    }

    sendResponse(req, res, 200, patient);
  } catch (err) {
    console.error(err.message);
    sendResponse(req, res, 200, {
      error: `Something went wrong ${err.message}`,
    });
  }
});

router.post("/api/patients", async (req, res) => {
  try {
    let data = await readFile(patientsPath);

    if (data === "None") {
      data = { nextId: 1, patients: [] };
    }

    const newPatientInfo = await readBody(req);
    const { name, age, diagnosis } = newPatientInfo;

    if (!name || !age || !diagnosis)
      return sendResponse(req, res, 400, {
        error: "name, age and diagnosis required",
      });

    const newPatient = {
      id: data.nextId,
      name,
      age,
      diagnosis,
    };

    data.nextId++;
    data.patients.push(newPatient);

    await writeFile(patientsPath, data);
    return sendResponse(req, res, 201, { patient: newPatient });
  } catch (err) {
    sendResponse(req, res, 400, { error: "Something went wrong" });
    console.error(err.message);
    return;
  }
});

router.patch("/api/patients/:id", async (req, res) => {
  try {
    const patients = await readFile(patientsPath);

    if (patients === "None") {
      sendResponse(req, res, 404, { error: "No Patients Found" });
      return;
    }

    if (!patients) {
      sendResponse(req, res, 400, {
        error: "Something went wrong reading patients",
      });
      return;
    }

    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      sendResponse(req, res, 400, { error: "id must be a number" });
      return;
    }

    const patient = patients.patients.find((p) => p.id === id);

    if (!patient) {
      sendResponse(req, res, 404, { error: "Patient could not be found" });
      return;
    }

    const updates = await readBody(req);

    if (!updates) {
      sendResponse(req, res, 400, { error: "Nothing to update passed" });
      return;
    }

    const propertiesToUpdate = Object.keys(updates);

    for (let property of propertiesToUpdate) {
      patient[property] = updates[property];
    }

    await writeFile(patientsPath, patients);

    sendResponse(req, res, 200, { status: "Updated Complete" });
  } catch (err) {
    console.error(err.message);
    sendResponse(req, res, 200, {
      error: `Something went wrong ${err.message}`,
    });
  }
});

router.delete("/api/patients/:id", async (req, res) => {
  try {
    const patients = await readFile(patientsPath);

    if (patients === "None") {
      sendResponse(req, res, 404, { error: "No Patients Found" });
      return;
    }

    if (!patients) {
      sendResponse(req, res, 400, {
        error: "Something went wrong reading patients",
      });
      return;
    }

    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      sendResponse(req, res, 400, { error: "id must be a number" });
      return;
    }

    const patient = patients.patients.find((p) => p.id === id);

    if (!patient) {
      sendResponse(req, res, 404, { error: "Patient could not be found" });
      return;
    }

    const updatedPatients = patients.patients.filter((p) => p.id !== id);
    patients.patients = updatedPatients;

    await writeFile(patientsPath, patients);

    sendResponse(req, res, 201, { status: `patient with id ${id} deleted` });
    return patient;
  } catch (err) {
    console.error(err.message);
    sendResponse(req, res, 200, {
      error: `Something went wrong ${err.message}`,
    });
  }
});

// ROUTES FOR VITALS

// router.get("/api/patients/:id/vitals", () => {});

// router.get("/api/patients/:id/vitals/latest", () => {});

// router.get("/api/patients/:id/vitals/:vitalId", () => {});

// SERVER

const server = http.createServer((req, res) => {
  router.handle(req, res);
});

server.listen(3000, () => console.log("server listening at port 8000"));
