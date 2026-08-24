let balance = 100;

function deposit(amt) {
  return (balance += amt);
}

function withdraw(amt) {
  return (balance -= amt);
}

function getBalance() {
  return balance;
}

module.exports = { deposit, withdraw, getBalance };
