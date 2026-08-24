console.log("counter.js is running and being loaded into memory...");

let count = 0;

function increament() {
  count++;
  return count;
}

module.exports = { increament };
