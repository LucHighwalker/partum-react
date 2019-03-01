const fs = require('fs');
const path = require('path');

const Options = require('./options');
const optionsPath = path.join(process.cwd(), 'partum.json');

const componentTemp = require('../boiler/templates/component');
const styleTemp = require('../boiler/templates/style');

const helper = require('./helper');

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

class Generator {
  constructor() {
    const options = JSON.parse(JSON.stringify(require(optionsPath)));
    this.options = new Options(options.name, options);
  }

  generateComponent(args) {
    const name = args[1];
    const fileExt = this.options.jsx ? 'jsx' : 'js';
    const fileName = `${name}.${fileExt}`;
    // helper.ensureDirExists(path.join(process.cwd, '/src/components/'));
    const filePath = path.join(process.cwd(), `/src/components/${name}/`);
    const className = capitalize(name);

    helper.ensureDirExists(filePath);
    fs.writeFile(
      path.join(filePath, fileName),
      componentTemp(name, className, this.options.styleExt),
      err => {
        if (err) {
          console.error(err.message);
        }
        this.generateStyle(name, filePath);
      }
    );
  }

  generateStyle(name, filePath) {
    const fileName = `${name}.${this.options.styleExt}`;
    helper.ensureDirExists(filePath);
    fs.writeFile(path.join(filePath, fileName), styleTemp(name), err => {
      if (err) {
        console.error(err.message);
      }
      console.log(`Generated ${name} component.`);
    });
  }
}

module.exports = Generator;
