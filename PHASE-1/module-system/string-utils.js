function capWholeStr(str) {
  return str.toUpperCase();
}

function capFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function reverseStr(str) {
  return str.split("").reverse().join("");
}

function isPalindromic(str) {
  return str.toLowerCase() === str.split("").reverse().join("").toLowerCase();
}

module.exports = { capFirstLetter, capWholeStr, reverseStr, isPalindromic };
