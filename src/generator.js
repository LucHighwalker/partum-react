const fs = require('fs');
const path = require('path');
const Options = require('./options');

const optionsPath = path.join(process.cwd(), 'partum.json');

const componentTemp = require('../boiler/templates/components/component');
const funcComponentTemp = require('../boiler/templates/components/funcComponent');
const styleTemp = require('../boiler/templates/components/style');
const actionTemp = require('../boiler/templates/redux/action');

const {
  ensureDirExists,
  processStates,
  capitalize,
} = require('./helper');

module.exports = class Generator {
  constructor() {
    const options = JSON.parse(JSON.stringify(require(optionsPath))); // eslint-disable-line
    this.options = new Options(options.name, options);
  }

  /* eslint-disable */
  generateAction(args) {
    const name = args[1];
    const filePath = path.join(process.cwd(), '/src/redux/actions/');
    const fileName = args[2] ? args[2] : 'actions.js';
    const fullPath = path.join(filePath, fileName);
    const reducerName = args[2] ? args[2] : 'reducer.js';
    const action = actionTemp(name, capitalize(name));

    fs.stat(fullPath, (err, _) => {
      if (err == null) {
        fs.appendFile(fullPath, `\n${action}`, (err) => {
          if (err) {
            throw err;
          } else {
            process.stdout.write(`Generated action '${name}'.\n`);
          }
        });
      } else if (err.code === 'ENOENT') {
        fs.writeFile(fullPath, action, (err) => {
          if (err) {
            throw err;
          } else {
            process.stdout.write(`Generated action '${name}'.\n`);
          }
        });
      } else {
        throw err;
      }
    });
  }
  /* eslint-enable */

  generateComponent(args) {
    const name = args[1];
    const fileExt = this.options.jsx ? 'jsx' : 'js';
    const filePath = path.join(process.cwd(), `/src/components/${name}/`);
    const fileName = `${name}.${fileExt}`;
    const componentName = capitalize(name);
    const rawStates = [];

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
            rawStates.push(args[i]);
          } else {
            process.stdout.write('Invalid option(s) for component generation.\n');
          }
      }
    }

    const states = processStates(rawStates);

    const content = functional
      ? funcComponentTemp(name, componentName, this.options.styleExt)
      : componentTemp(name, componentName, this.options.styleExt, states);

    ensureDirExists(filePath);
    fs.writeFile(
      path.join(filePath, fileName),
      content,
      (err) => {
        if (err) {
          throw err;
        } else {
          this.generateStyle(name, filePath);
        }
      },
    );
  }

  generateStyle(name, filePath) {
    const fileName = `${name}.${this.options.styleExt}`;
    ensureDirExists(filePath);
    fs.writeFile(path.join(filePath, fileName), styleTemp(name), (err) => {
      if (err) {
        throw err;
      } else {
        process.stdout.write(`Generated ${name} component.\n`);
      }
    });
  }
};
