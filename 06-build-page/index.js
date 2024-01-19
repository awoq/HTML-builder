const fs = require('fs');
const path = require('path');

const getData = async (filePath) => {
  const readStream = fs.createReadStream(filePath, 'utf-8');
  let data = '';
  for await (const chunk of readStream) {
    data += chunk;
  }
  return data;
};

const getComponents = async () => {
  let components = {};
  const files = await fs.promises.readdir(path.join(__dirname, 'components'), {
    withFileTypes: true,
  });
  for (let file of files) {
    const filePath = path.join(__dirname, 'components', file.name);
    const extName = path.extname(filePath);
    if (file.isFile() && extName === '.html') {
      const tagName = path.basename(filePath, extName);
      const data = await getData(filePath);
      components[tagName] = data;
    }
  }
  return components;
};

function injectTemplates(template, components) {
  let newTemplate = template;
  for (let key in components) {
    newTemplate = newTemplate.replaceAll(`{{${key}}}`, components[key]);
  }
  return newTemplate;
}

async function getStyles() {
  const files = await fs.promises.readdir(path.join(__dirname, 'styles'), {
    withFileTypes: true,
  });
  let styles = [];
  for (let file of files) {
    const filePath = path.join(__dirname, 'styles', file.name);
    if (file.isFile() && path.extname(filePath) === '.css') {
      const data = await getData(filePath);
      styles.push(data);
    }
  }
  return styles;
}

async function copyDirectory(dirPath, newDirPath) {
  await fs.promises.mkdir(newDirPath, { recursive: true });
  const filenames = await fs.promises.readdir(dirPath, { withFileTypes: true });
  for (let filename of filenames) {
    const filepath = path.join(dirPath, filename.name);
    const newpath = path.join(newDirPath, filename.name);
    if (filename.isFile()) {
      try {
        await fs.promises.copyFile(filepath, newpath);
      } catch {
        console.log('The file could not be copied');
      }
    } else {
      await copyDirectory(filepath, newpath);
    }
  }
}

(async () => {
  try {
    let template = await getData(path.join(__dirname, 'template.html'));
    const components = await getComponents();
    template = injectTemplates(template, components);
    const styles = await getStyles();

    await fs.promises.mkdir(path.join(__dirname, 'project-dist'), {
      recursive: true,
    });
    const oldFiles = await fs.promises.readdir(
      path.join(__dirname, 'project-dist'),
    );
    if (oldFiles.length) {
      for (let oldFile of oldFiles) {
        const oldFilePath = path.join(__dirname, 'project-dist', oldFile);
        await fs.promises.rm(oldFilePath, { recursive: true });
      }
    }

    const htmlWriteStream = fs.createWriteStream(
      path.join(__dirname, 'project-dist', 'index.html'),
      'utf-8',
    );
    htmlWriteStream.write(`${template}`);

    const stylesWriteStream = fs.createWriteStream(
      path.join(__dirname, 'project-dist', 'style.css'),
      'utf-8',
    );
    for (let style of styles) {
      stylesWriteStream.write(`${style}\n`);
    }

    await copyDirectory(
      path.join(__dirname, 'assets'),
      path.join(__dirname, 'project-dist', 'assets'),
    );
  } catch (error) {
    console.log(error);
  }
})();
