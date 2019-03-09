const fs = require('fs');
const path = require('path');

const Options = require('./options');
const optionsPath = path.join(process.cwd(), 'partum.json');

const componentTemp = require('../boiler/templates/component');
const funcComponentTemp = require('../boiler/templates/funcComponent');
const styleTemp = require('../boiler/templates/style');

const helper = require('./helper');

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

module.exports = class Generator {
  constructor() {
    const options = JSON.parse(JSON.stringify(require(optionsPath)));
    this.options = new Options(options.name, options);
  }

  generateComponent(args) {
    const name = args[1];
    const fileExt = this.options.jsx ? 'jsx' : 'js';
    const fileName = `${name}.${fileExt}`;
    const filePath = path.join(process.cwd(), `/src/components/${name}/`);
    const componentName = capitalize(name);
    const states = [];

    let functional = false;

    for (let i = 2; i < args.length; i += 1) {
      switch (args[i]) {
        case '-f':
        case '--func':
        case '--functional':
          functional = true;
          break;

        default:
          if (/(=)/.test(args[i]) && !functional) {
            states.push(args[i]);
          } else {
            console.log('Invalid option(s) for component generation.');
          }
      }
    }

    const state = this.processStates(states);

    const content = functional ?
      funcComponentTemp(name, componentName, this.options.styleExt) :
      componentTemp(name, componentName, this.options.styleExt, state);

    helper.ensureDirExists(filePath);
    fs.writeFile(
      path.join(filePath, fileName),
      content,
      err => {
        if (err) {
          console.error(err.message);
        }
        this.generateStyle(name, filePath);
      }
    );
  }

  processStates(states) {
    if (states.length === 0) {
      return null;
    } else {
      let processed = '';
      let comma = '';
      for (let i = 0; i < states.length; i += 1) {
        const split = states[i].split('=');
        processed = `${processed}${comma}\n\t\t\t${split[0]}: ${split[1]}`;
        comma = ',';
      }
      return `this.state = {${processed}\n\t\t}`;
    }
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
};
