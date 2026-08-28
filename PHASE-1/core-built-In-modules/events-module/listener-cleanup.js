const EventEmitter = require("events");

class SessionManager extends EventEmitter {
  constructor() {
    super();
  }

  login(userId) {
    this.emit("userloggedIn", userId);
  }

  logout(userId) {
    this.emit("userloggedOut", userId);
  }
}

const user = new SessionManager();

user.on("userloggedIn", (userId) => console.log(`user ${userId} logged in`));
user.once("userloggedIn", (userId) =>
  console.log(`first loggin of the session- security check initiated`),
);

user.on("userloggedOut", (userId) => console.log(`user ${userId} logged out`));

user.login(1);
user.login(2);
