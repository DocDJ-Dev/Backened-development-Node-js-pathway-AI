const os = require("os");

console.log(os.platform());
console.log(os.cpus().length);
console.log(os.homedir());

const totalmem = (os.totalmem() / (1024 * 1024 * 1024)).toFixed(2);
const freemem = (os.freemem() / (1024 * 1024 * 1024)).toFixed(2);

console.log(totalmem); //in GB
console.log(freemem); // in GB

console.log((os.uptime() / 3600).toFixed(2)); //in hours
