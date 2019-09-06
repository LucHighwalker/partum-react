const fs = require('fs');
const path = require('path');
const Options = require('./options');

const ErrorHandler = require('./errorHandler');

const componentTemp = require('../boiler/templates/components/component');
const funcComponentTemp = require('../boiler/templates/components/funcComponent');
const styleTemp = require('../boiler/templates/components/style');
const actionTemp = require('../boiler/templates/redux/action');
const reducerTemp = require('../boiler/templates/redux/reducer');
const rootReducerTemp = require('../boiler/templates/redux/rootReducer');

const {
  ensureDirExists, processStates, capitalize, upperCase,
} = require('./helper');

module.exports = class Generator {
  constructor() {
    this.options = new Options('', true);
    this.rootReducerPath = path.join(process.cwd(), '/src/redux/reducers/rootReducer.js');
  }

  /* eslint-disable class-methods-use-this */
  async generateAction(args) {
    try {
      if (this.options.redux) {
        const actionFileDir = path.join(
          process.cwd(),
          this.options.reduxPath,
          this.options.actionPath,
        );
        const reducerFileDir = path.join(
          process.cwd(),
          this.options.reduxPath,
          this.options.reducerPath,
        );

        const actionName = args[1];
        const actionType = upperCase(actionName);
        const actionFile = args[2] ? `${args[2]}.js` : 'actions.js';
        const actionPath = path.join(actionFileDir, actionFile);

        const reducerName = args[3] ? args[3] : 'reducer';
        const reducerFile = `${reducerName}.js`;
        const reducerPath = path.join(reducerFileDir, reducerFile);

        const action = actionTemp(actionName, actionType);
        await this.createAction(actionPath, action);
        await this.createReducer(reducerPath, reducerName, actionType);

        process.stdout.write(`Generated action '${actionName}'.\n`);
      } else {
        process.stdout.write('Cannot create action inside a non-redux project.\n');
      }
    } catch (error) {
      ErrorHandler(error);
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

  createReducer(reducerPath, reducerName, actionType) {
    return new Promise((resolve, reject) => {
      fs.stat(reducerPath, (err, _) => {
        if (err == null) {
          fs.readFile(reducerPath, 'utf8', (err, data) => {
            if (err) {
              reject(err);
            } else {
              const matches = data.match(
                /(case '[A-Za-z_-]+':\s+return (state|{\s+([a-zA-Z]+: [a-zA-Z0-9+\-_/*\s']+,\s+)+}))/gm,
              );
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
              fs.readFile(this.rootReducerPath, 'utf8', (err, data) => {
                if (err) {
                  reject(err);
                } else {
                  const newImport = `import ${reducerName} from './${reducerName}';`;
                  let rawImports = data.match(/(import [A-Za-z_-]+ from '.\/[A-Za-z]+(.js)?';?)/gm);
                  if (rawImports !== null) {
                    rawImports.push(newImport);
                  } else {
                    rawImports = [newImport];
                  }
                  const reducers = this.getReducers(rawImports);

                  const imports = `\n${rawImports.join('\n')}`;

                  const rootReducer = rootReducerTemp(imports, reducers);
                  fs.writeFile(this.rootReducerPath, rootReducer, (err) => {
                    if (err) {
                      reject(err);
                    } else {
                      resolve(true);
                    }
                  });
                }
              });
            }
          });
        } else {
          reject(err);
        }
      });
    });
  }

  getReducers(imports) {
    let reducers = '';
    for (let i = 0; i < imports.length; i += 1) {
      const split = imports[i].split(' ');
      reducers = `${reducers}\n\t${split[1]},`;
    }
    return `${reducers}\n`;
  }

  generateComponent(args) {
    const name = args[1];
    const fileExt = this.options.jsx ? 'jsx' : 'js';
    const filePath = this.options.componentFolders
      ? path.join(process.cwd(), this.options.componentPath, name)
      : path.join(process.cwd(), this.options.componentPath);

    const fileName = this.options.componentFolders ? `index.${fileExt}` : `${name}.${fileExt}`;
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
      ? funcComponentTemp(
        name,
        componentName,
        this.options.styleExt,
        this.options.componentFolders,
        this.options.redux,
      )
      : componentTemp(
        name,
        componentName,
        this.options.styleExt,
        states,
        this.options.componentFolders,
        this.options.redux,
      );

    ensureDirExists(filePath);
    fs.writeFile(path.join(filePath, fileName), content, (err) => {
      if (err) {
        throw err;
      } else {
        this.generateStyle(name, filePath);
      }
    });
  }

  generateStyle(name, filePath) {
    const fileName = `${this.options.componentFolders ? 'style' : name}.${this.options.styleExt}`;
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
