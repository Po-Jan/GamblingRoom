console.log("Player:", playerName);
console.log("Balance:", playerBalance);

// You can also assign it somewhere like:
document.querySelector('.nameDiv span').textContent = `Welcome, ${playerName}`;
document.querySelector('.balanceDiv span').textContent = `Balance: $${playerBalance}`;
