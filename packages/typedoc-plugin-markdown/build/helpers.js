const path = require('path');
const fs = require('fs');
const helpersFolder = path.join(__dirname, '..', 'src', 'resources', 'helpers');
const helpersFiles = fs
  .readdirSync(helpersFolder)
  .map((helperFile) => path.parse(helperFile).name);

const out = [`const Handlebars = require("handlebars/runtime");`];

helpersFiles.forEach((helperFile) => {
  out.push(
    `Handlebars.registerHelper('${helperFile}', require('./helpers/${helperFile}')['${helperFile}']);`,
  );
});

fs.writeFileSync('./dist/resources/helpers.js', out.join('\n'));
