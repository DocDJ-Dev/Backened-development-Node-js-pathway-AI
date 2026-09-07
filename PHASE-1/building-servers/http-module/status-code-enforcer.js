//
const http = require("http");

const patients = {
  1: {
    id: 1,
    name: "James",
    age: 23,
    doctor: "Dr. Osei Mensah",
    diagnosis: "Hypertension",
  },
  2: {
    id: 2,
    name: "Desire",
    age: 54,
    doctor: "Dr. Carol",
    diagnosis: "Asthma",
  },
  3: { id: 3, name: "John", age: 24, doctor: "Dr. Darko", diagnosis: "D2M" },
};

function buildReportChunks(patient) {
  const date = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return [
    // chunk 1- Patient Header
    `\n==========MEDICAL REPORT=======\n
    Patient Name    : ${patient.name}
    Patient ID      : ${patient.id}
    Date            : ${date}
    Attending       : ${patient.doctor}`,

    // chunk 2- Vital Signs
    `\n==========VITAL SIGNS=========\n
    HR             : 78bpm
    BP             : 138/88 mmHg
    Temp           : 37.2
    Weight         : 72kg`,

    // chunk 3- diagnosis and meds
    `\n========DIAGNOSIS AND MEDS======\n
    Primary Diagnosis :  ${patient.diagnosis}
    Status            : Under Active Mgmt
    Meds              : Asprin, Vitamin`,

    // chunk 4- Doctor Notes
    `\n=======DOCTOR NOTES AND RECOMMENDATIONS==\n
    Notes:  Patient responding wonderfully to current meds.
    
    Follow up:  scheduled for 6 months with FBC
    
    Signed: ${patient.doctor}
    
    END OF REPORT`,
  ];
}

const server = http.createServer((req, res) => {
  const method = req.method;
  const url = req.url;

  console.log(`\n${method} ${url}`);

  // Only handle GET requests
  if (method !== "GET") {
    res.writeHead(405, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ error: "Only GET request allowed" }));
  }

  //   Parsing the URL manually
  const parts = url.split("/");
  //   '/report/1' => ['', 'report', '1']

  //   Validating URL
  if (parts.length !== 3 || parts[1] !== "report") {
    res.writeHead(404, { "Content-Type": "application/json" });
    return res.end(
      JSON.stringify({
        error: "Route not found",
        expected: "/report/:patientId",
        received: url,
      }),
    );
  }

  //   Extract and Validate patient ID

  const patientId = parseInt(parts[2]);

  if (isNaN(patientId)) {
    res.writeHead(400, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ error: "ID Must be a number" }));
  }

  //   Find the Patient
  const patient = patients[patientId];

  if (!patient) {
    res.writeHead(404, { "Content-Type": "application/json" });
    return res.end(
      JSON.stringify({
        error: `Patient with ${patientId} not found`,
        availableIds: Object.keys(patients).map(Number),
      }),
    );
  }

  console.log(`Generating report for the patient ${patientId}`);
  console.log(`Streaming 4 chunks at 300ms intervals...`);

  //   setting headers
  res.writeHead(200, {
    "content-type": "text/plain; charset=utf-8",
    "X-patient-Id": patientId,
    "X-Report-Chunks": "4",
  });

  const chunks = buildReportChunks(patient);
  let chunkIndex = 0;

  const interval = setInterval(() => {
    const chunk = chunks[chunkIndex];

    res.write(chunk);
    console.log(`Sent chunk ${chunkIndex + 1}`);

    chunkIndex++;

    if (chunkIndex === chunks.length) {
      clearInterval(interval);
      res.end();
      console.log(`Report complete for patients ${patientId}`);
    }
  }, 500);

  req.on("close", () => {
    if (chunkIndex < chunks.length) {
      clearInterval(interval);
      console.log("client disconnected midstream");
    }
  });
});

server.listen(3000, () => {
  console.log("listening on port 3000");
});
