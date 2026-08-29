const fs = require("fs");
const path = require("path");

const EventEmitter = require("events");

// fs.writeFileSync(path.join(__dirname, "text.txt"), "Hello", "utf-8");
// console.log("1- Synchronous : runs immediately, top of call stack");

// process.nextTick(() =>
//   console.log("2- process.nextTick: microtask, runs everything async"),
// );

// Promise.resolve().then(() =>
//   console.log(
//     "3 - Promises: runs after nextTick, before Tmers or I/O callbacks",
//   ),
// );

// setTimeout(() => console.log("4- Timers phase after microtasks"), 0);

// setImmediate(() => console.log("5. Check phase after the Poll"));

// fs.readFile(path.join(__dirname, "text.txt"), "utf-8", (err, result) => {
//   console.log("===== POLL PHASE =====");
//   if (err) {
//     if (err.code === "ENOENT") {
//       console.log("6. file doesnt exist");
//     }

//     console.log(err.message);
//   }

//   console.log("6. readFile in poll phase", JSON.stringify(result, 2, null));

//   setTimeout(() => {
//     console.log("7. SetTimeout inside the poll phase, for the next cycle");
//   });

//   setImmediate(() =>
//     console.log("8. setImediate inside poll phase: for same loop Check phase"),
//   );
// });

// console.log("9. Sync, still runs before the everything async");

// class Monitor extends EventEmitter {
//   constructor(id) {
//     super();
//     this.patientId = id;

//     process.nextTick(() => this.emit("ready", this.patientId));
//   }
// }

// const p1 = new Monitor(1);
// // listener registering after constructor finished running.  catch it if it is wrapped in processs.nextTick()
// p1.on("ready", (patientId) => {
//   console.log(`Patient ${patientId} ready`);
// });

// const start = Date.now();
// // simulation of cpu intensive work blocking the main thread
// let count = 0;
// for (let i = 0; i < 1000000000; i++) {
//   count++;
// }
// console.log(`Blocking work done in ${Date.now() - start}ms`);

// setTimeout(() => {
//   console.log(`Timer fired after ${Date.now() - start}ms`);
// }, 100);

const start = Date.now();
let count = 0;
let i = 0;

function doChunk() {
  const chunkEnd = Math.min(i + 10000000, 1000000000);
  for (; i < chunkEnd; i++) {
    count++;
  }

  if (i < 1000000000) {
    setImmediate(doChunk);
  } else {
    console.log(`Non blocking work done in ${Date.now() - start}ms`);
  }
}

doChunk();
setTimeout(() => console.log(`Timer fired after ${Date.now() - start}ms`), 100);
