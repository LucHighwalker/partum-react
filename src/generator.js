const fs = require('fs');
const path = require('path');
const Options = require('./options');

const optionsPath = path.join(process.cwd(), 'partum.json');

const componentTemp = require('../boiler/templates/components/component');
const funcComponentTemp = require('../boiler/templates/components/funcComponent');
const styleTemp = require('../boiler/templates/components/style');
const actionTemp = require('../boiler/templates/redux/action');
const reducerTemp = require('../boiler/templates/redux/reducer');

const {
  ensureDirExists,
  processStates,
  capitalize,
  upperCase,
} = require('./helper');

module.exports = class Generator {
  constructor() {
    const options = JSON.parse(JSON.stringify(require(optionsPath))); // eslint-disable-line
    this.options = new Options(options.name, options);
  }

  /* eslint-disable class-methods-use-this */
  async generateAction(args) {
    try {
      const actionName = args[1];
      const actionType = upperCase(actionName);
      const actionFileDir = path.join(process.cwd(), '/src/redux/actions/');
      const actionFile = args[2] ? `${args[2]}.js` : 'actions.js';
      const actionPath = path.join(actionFileDir, actionFile);

      const reducerFileDir = path.join(process.cwd(), '/src/redux/reducers/');
      const reducerFile = args[3] ? `${args[3]}.js` : 'reducer.js';
      const reducerPath = path.join(reducerFileDir, reducerFile);

      const action = actionTemp(actionName, actionType);
      await this.createAction(actionPath, action);
      await this.createReducer(reducerPath, actionType);

      process.stdout.write(`Generated action '${actionName}'.\n`);
    } catch (error) {
      throw error;
    }
  }

  createAction(actionPath, action) {
    return new Promise((resolve, reject) => {
      fs.stat(actionPath, (err, _) => {
        if (err == null) {
          fs.appendFile(actionPath, `\n${action}`, (err) => {
            if (err) {
              reject(err);
            } else {
              resolve(true);
            }
          });
        } else if (err.code === 'ENOENT') {
          fs.writeFile(actionPath, action, (err) => {
            if (err) {
              reject(err);
            } else {
              resolve(true);
            }
          });
        } else {
          reject(err);
        }
      });
    });
  }

  createReducer(reducerPath, actionType) {
    return new Promise((resolve, reject) => {
      fs.stat(reducerPath, (err, _) => {
        if (err == null) {
          fs.readFile(reducerPath, 'utf8', (err, data) => {
            if (err) {
              reject(err);
            } else {
              const matches = data.match(/(case '[A-Za-z_-]+':\s+return (state|{\s+([a-zA-Z]+: [a-zA-Z0-9+\-_/*\s']+,\s+)+}))/gm);
              const prevActions = matches.length > 0 ? `\n\t\t${matches.join('\n\n\t\t')}\n\n` : '';
              const reducer = reducerTemp(actionType, prevActions);
              fs.writeFile(reducerPath, reducer, (err) => {
                if (err) {
                  reject(err);
                } else {
                  resolve(true);
                }
              });
            }
          });
        } else if (err.code === 'ENOENT') {
          const reducer = reducerTemp(actionType);
          fs.writeFile(reducerPath, reducer, (err) => {
            if (err) {
              reject(err);
            } else {
              resolve(true);
            }
          });
        } else {
          reject(err);
        }
      });
    });
  }

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
/* eslint-enable class-methods-use-this */
};
