const { add, sub, divide } = require("./math-utils");

console.log(add(10, 10));
console.log(sub(10, 10));
console.log(divide(10, 10));
// console.log(mult(10, 10)); // ReferenceError: mult is not defined

console.log(__filename);
console.log(__dirname);
