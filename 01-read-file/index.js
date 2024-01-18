const fs = require('fs');
const path = require('path');
const fullPath = path.join(__dirname, 'text.txt');
const readStream = fs.createReadStream(fullPath, 'utf-8');
let data = '';
readStream.on('data', (chunk) => (data += chunk));
readStream.on('end', () => console.log(data));
readStream.on('error', (error) => console.log('Error', error.message));
