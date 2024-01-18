const fs = require('fs');
const path = require('path');
const fullPath = path.join(__dirname, 'secret-folder');

(async () => {
  try {
    const filenames = await fs.promises.readdir(fullPath, {
      withFileTypes: true,
    });
    for (let filename of filenames) {
      if (filename.isFile()) {
        const filepath = path.join(fullPath, filename.name);
        const extname = path.extname(filepath);
        const stat = await fs.promises.stat(filepath);
        console.log(
          `${path.basename(filepath, extname)} - ${extname.substr(1)} - ${
            stat.size / 1024
          }kb`,
        );
      }
    }
  } catch (error) {
    console.log('Error:', error.message);
  }
})();
