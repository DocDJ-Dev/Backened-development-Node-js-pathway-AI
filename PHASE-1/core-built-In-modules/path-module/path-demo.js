const path = require("path");

// console.log(__dirname);

const filePath = path.join(__dirname, "data", "users.json");
// console.log(filePath);

const resolvedPath = path.resolve("data", "user.json");
console.log(resolvedPath);

// const fullPath = "/home/user/projects/app.js";

// console.log(path.basename(fullPath));
// console.log(path.dirname(fullPath));
// console.log(path.extname(fullPath));

// console.log(path.parse(fullPath));
