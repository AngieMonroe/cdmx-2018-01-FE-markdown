#! / usr / bin / env node

const mdLinks = require('./mdLinks');

// Captura de argumentos
const args = process.argv.slice(2);
console.log(args)

args.forEach((val, index) => {
  console.log(`${index} ${val}`);
});

