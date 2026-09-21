const app = require("./src/app");
const dotenv = require("dotenv");

dotenv.config();

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`
────────────────────────────────────────
  Medical API Server
  Environment : ${process.env.NODE_ENV || "development"}
  Port        : ${PORT}
  Started     : ${new Date().toISOString()}
────────────────────────────────────────
  Routes:
  GET    /api/patients
  GET    /api/patients/:id
  POST   /api/patients
  PATCH  /api/patients/:id
  DELETE /api/patients/:id
  POST   /api/patients/:id/vitals
  GET    /api/patients/:id/vitals
  GET    /api/patients/:id/vitals/latest
────────────────────────────────────────
  `);
});

// Graceful shutdown — when process is terminated (Ctrl+C or server restart)
// finish handling current requests before shutting down
// rather than abruptly killing everything mid-request

process.on("SIGTERM", () => {
  console.log("SIGTERM received — shutting down gracefully");
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});
