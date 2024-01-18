const fs = require('fs');
const path = require('path');

const copyDirectory = async () => {
  await fs.promises.mkdir(path.join(__dirname, 'files-copy'), {
    recursive: true,
  });
  const oldFiles = await fs.promises.readdir(
    path.join(__dirname, 'files-copy'),
  );
  if (oldFiles.length) {
    for (let oldfile of oldFiles) {
      await fs.promises.unlink(path.join(__dirname, 'files-copy', oldfile));
    }
  }
  const fileNames = await fs.promises.readdir(path.join(__dirname, 'files'));
  for (let fileName of fileNames) {
    const filePath = path.join(__dirname, 'files', fileName);
    const newPath = path.join(__dirname, 'files-copy', fileName);
    try {
      await fs.promises.copyFile(filePath, newPath);
    } catch {
      console.log('The file could not be copied');
    }
  }
};

copyDirectory();
