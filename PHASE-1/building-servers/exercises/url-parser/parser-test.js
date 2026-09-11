const { parseURL } = require("./url-parser");

const host = "localhost:3000";

// Test 1 — Simple path, no query params
console.log("Test 1 — Simple path:");
console.log(parseURL("/patients", host));
// Expected: segments: ['patients'], query: {}, hasQuery: false

// Test 2 — Multiple query params
console.log("\nTest 2 — Multiple query params:");
console.log(parseURL("/patients?search=alice&diagnosis=asthma", host));
// Expected: query: { search: 'alice', diagnosis: 'asthma' }, hasQuery: true

// Test 3 — Trailing slash
console.log("\nTest 3 — Trailing slash:");
console.log(parseURL("/patients/", host));
// Expected: segments: ['patients'] — trailing slash removed cleanly

// Test 4 — Deep path
console.log("\nTest 4 — Deep path:");
console.log(parseURL("/api/v1/patients/42/vitals", host));
// Expected: segments: ['api', 'v1', 'patients', '42', 'vitals']

// Test 5 — Root path only
console.log("\nTest 5 — Root path:");
console.log(parseURL("/", host));
// Expected: segments: [], query: {}, hasQuery: false

// Test 6 — Path with id and query combined
console.log("\nTest 6 — Path with id and query:");
console.log(parseURL("/patients/42?include=vitals&format=json", host));
// Expected: segments: ['patients', '42'], query: { include: 'vitals', format: 'json' }
