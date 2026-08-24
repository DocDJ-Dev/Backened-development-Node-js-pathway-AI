function add(a, b) {
  return a + b;
}

function sub(a, b) {
  return a - b;
}

function mult(a, b) {
  a * b;
}

function divide(a, b) {
  return a / b;
}

// Every code inside this file makes the code of this module
// nothing is visible in other modules unless exported

module.exports = { add, sub, divide };
