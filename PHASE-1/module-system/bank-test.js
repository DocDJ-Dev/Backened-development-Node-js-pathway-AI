const { deposit, withdraw, getBalance } = require("./bank-account");

deposit(50);
withdraw(30);
console.log(getBalance()); //120: proving cache is real

// Balance cannot be directly accessible or manipulated because it is not exported. demonstration of privacy
