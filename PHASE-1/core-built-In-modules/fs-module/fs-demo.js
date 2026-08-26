const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "notes.txt");

//===== SYNC ======
fs.writeFileSync(filePath, "hello from sync write!\n");
console.log("sync write done");

const syncContent = fs.readFileSync(filePath, "utf-8");
console.log("syncData:", syncContent);

// ===== ASYNC (CALLBACK) =====
fs.writeFile(filePath, "heloo from async write!\n", (err) => {
  if (err) {
    console.error("Something went wrong:", err);
    return;
  }
  console.log("async write finished");
});

// ===== ASYNC(PROMISES)======
async function readWithPromises() {
  try {
    const content = await fs.promises.readFile(filePath, "utf-8");
    console.log(content);
  } catch (err) {
    console.error(err);
  }
}

readWithPromises();
