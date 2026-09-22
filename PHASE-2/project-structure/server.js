const app = require("./src/app");
const dotenv = require("dotenv");

dotenv.config();

// Catches errors thrown SYNCHRONOUSLY anywhere that nothing else caught

process.on("uncaughtException", (err) => {
  console.error("─── UNCAUGHT EXCEPTION ──────────────────");
  console.error("This is a serious bug. The process will now exit.");
  console.error(err);
  console.error("──────────────────────────────────────────");

  // Best practice: exit the process after an uncaught exception
  // The application state may be corrupted — continuing could cause worse problems (data corruption, security issues)
  // A process manager (like pm2, covered in Topic 9) should restart it automatically
  process.exit(1);
});

// Catches Promise rejections that NOTHING handled anywhere in the app
process.on("unhandledRejection", (reason, promise) => {
  console.error("─── UNHANDLED REJECTION ─────────────────");
  console.error("Reason:", reason);
  console.error("──────────────────────────────────────────");

  // Same principle — treated as seriously as uncaughtException
  process.exit(1);
});

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
