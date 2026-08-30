const fs = require("fs");
const path = require("path");
const { Transform } = require("stream");

// Without Streams
// This reads the entire file into the memory before doing anything with it
// fs.readFile(path.join(__dirname, "large-file.txt"), "utf-8", (err, data) => {});
// for large files like 2gb file, this would require 2Gb of RAM

// With Streams
// const readStream = fs.createReadStream(
//   path.join(__dirname, "large-file.txt"),
//   "utf-8",
// );
// const writeStream = fs.createWriteStream(
//   path.join(__dirname, "copy.txt"),
//   "utf-8",
// );

// // .pipe() connects the two and data flows chunk by chunk
// readStream.pipe(writeStream);

// writeStream.on("finish", () => {
//   console.log("file copied successfuly using streams");
// });

// Example 2

// creating test file to work with
// fs.writeFile(
//   path.join(__dirname, "patients-notes.txt"),
//   "Patient: James Desire: Hypertention\nMedications: Lisinopril 10mg\nNotes: Blood Pressure improving\n",
//   (err) => {
//     if (err) console.log("Something went wrong:", err.message);
//     console.log("successful");
//   },
// );

// READABLE STREAM
const readstream = fs.createReadStream(
  path.join(__dirname, "patients-notes.txt"),
  {
    encoding: "utf-8",
    highWaterMark: 30,
  },
);
// highWaterMark: chunk size in bytes, deliberately set to tiny size
// default is 64KB

readstream.on("data", (chunk) =>
  console.log(`Chunk received: ${JSON.stringify(chunk)}`),
);

readstream.on("end", () => console.log("All chunks received"));

// TRANSFORM STREAM- modify data as it flows through

const upperCaseTransform = new Transform({
  transform(chunk, encoding, callback) {
    // 'chunk' arrive as buffer- convert to stringify, transform and push result
    // 'push' sends data downstream (to whatever comes next)
    this.push(chunk.toString().toUpperCase());
    callback(); // signals 'done processing this chunk, ready for the next one'
  },
});

// PIPELINE: read=> transform=> write
const sourceStream = fs.createReadStream(
  path.join(__dirname, "patients-notes.txt"),
);
const outputStream = fs.createWriteStream(
  path.join(__dirname, "patients-notes-upper.txt"),
);

sourceStream.pipe(upperCaseTransform).pipe(outputStream);

outputStream.on("finish", () => console.log("Uppercase version written"));
