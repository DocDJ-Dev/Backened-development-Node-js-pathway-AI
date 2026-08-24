// Counter is required 3 times but only the first runs while others are blocked by cache

const counterA = require("./counter");
const counterB = require("./counter");
const counterC = require("./counter");

console.log(counterA.increament()); //1
console.log(counterB.increament()); //2
console.log(counterC.increament()); //3

// note "counter.js running..." only printed once
// counterA===counterB===counterC
