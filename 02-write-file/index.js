const fs = require('fs');
const path = require('path');
const fullPath = path.join(__dirname, 'text.txt');
const writeStream = fs.createWriteStream(fullPath, { flags: 'a' }, 'utf-8');
const stdout = process.stdout;
const stdin = process.stdin;

stdout.write('Hello! Enter your text:\n');

process.on('exit', () => stdout.write('Goodbye!\n'));
process.on('SIGINT', () => process.exit());

stdin.on('data', (data) => {
  if (data.toString().toLowerCase().trim() === 'exit') {
    process.exit();
  } else writeStream.write(data);
});
