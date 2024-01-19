const fs = require('fs');
const path = require('path');

(async () => {
  try {
    const files = await fs.promises.readdir(path.join(__dirname, 'styles'), {
      withFileTypes: true,
    });
    let styles = [];
    for (let file of files) {
      const filePath = path.join(__dirname, 'styles', file.name);
      if (file.isFile() && path.extname(filePath) === '.css') {
        const readStream = fs.createReadStream(filePath, 'utf-8');
        let data = '';
        for await (const chunk of readStream) {
          data += chunk;
        }
        styles.push(data);
      }
    }
    const writeStream = fs.createWriteStream(
      path.join(__dirname, 'project-dist', 'bundle.css'),
      'utf-8',
    );
    for (let style of styles) {
      writeStream.write(`${style}\n`);
    }
  } catch (error) {
    console.log(error);
  }
})();
