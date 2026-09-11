const http = require("http");
const { createRouter } = require("./extended-router");

const router = createRouter();

// Feature 3: .all() — runs for ANY method on this path
// Good for logging, CORS, or shared validation
router.all("/patients", (req, res) => {
  console.log(`router.all() caught: ${req.method} /patients`);

  // We still want to continue to specific handlers
  // For now just send a response to prove .all() works
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(
    JSON.stringify({
      message: `router.all() matched ${req.method} /patients`,
      feature: "any method matched",
    }),
  );
});

// Feature 2: trailing slash — both URLs hit this same handler
router.get("/about", (req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(
    JSON.stringify({
      message: "About route matched",
      feature: "trailing slash optional",
      note: "Try /about AND /about/ — both reach here",
    }),
  );
});

// Regular parameterized route
router.get("/patients/:id", (req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(
    JSON.stringify({
      message: "Patient route matched",
      patientId: req.params.id,
    }),
  );
});

// Feature 1: wildcard — MUST be registered LAST
// It catches everything that no previous route matched
router.get("*", (req, res) => {
  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(
    JSON.stringify({
      error: "Route not found",
      feature: "wildcard catch-all",
      attempted: req.pathname,
    }),
  );
});

const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);
  router.handle(req, res);
});

server.listen(3000, () => {
  console.log("Extended router test server running on port 3000");
  console.log("\nTest these in Postman:");
  console.log("  GET    http://localhost:3000/patients    ← router.all()");
  console.log("  POST   http://localhost:3000/patients    ← router.all()");
  console.log("  GET    http://localhost:3000/about       trailing slash test");
  console.log(
    "  GET    http://localhost:3000/about/      same route, trailing slash",
  );
  console.log("  GET    http://localhost:3000/patients/42 ← params");
  console.log(
    "  GET    http://localhost:3000/anything    wildcard catches this",
  );
});
