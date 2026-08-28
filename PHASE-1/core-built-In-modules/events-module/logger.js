const EventEmitter = require("events");

const logger = new EventEmitter();

logger.on("info", (message) => console.log(`[INFO] ${message}`));
logger.on("warning", (message) => console.log(`[WARNING] ${message}`));

logger.emit("info", `Server started on port 3000`);
logger.emit("warning", `Connecting to DB taking too long`);
