const path = require('path');
const copy = require('ncp').ncp;
const replace = require('replace-in-file');
const rmdir = require('rimraf');

const {
  ensureDirExists,
  writeFile,
  npmInstall,
  shell,
} = require('./helper');

const appTemplate = require('../boiler/templates/src/App');
const indexTemplate = require('../boiler/templates/src/index');

const appStyle = require('../boiler/templates/styles/app');
const indexStyle = require('../boiler/templates/styles/index');

const rootReducer = require('../boiler/templates/redux/rootReducer');

module.exports = class Initializer {
  constructor(options, destination, silent = false) {
    this.options = options;
    this.boilerPath = path.join(__dirname, '../boiler/');
    this.tempPath = path.join(__dirname, '../_temp/');
    this.destination = destination;

    this.silent = silent;

    rmdir(this.tempPath, (err) => {
      if (err) throw err;
    });
  }

  async initializeProject() {
    return new Promise(async (resolve, reject) => {
      try {
        await this.createBase();
        await this.addSrc();
        await this.addStyle();
        await this.addPackage();
        await this.finalize();
        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  }

  createBase() {
    return new Promise((resolve, reject) => {
      copy(`${this.boilerPath}main`, this.tempPath, (err) => {
        if (err) {
          reject(err);
        } else {
          this.options.save();
          resolve(true);
        }
      });
    });
  }

  addSrc() {
    return new Promise(async (resolve, reject) => {
      try {
        const srcPath = this.options.jsx ? 'jsx' : 'js';
        const {
          styleExt,
          redux,
        } = this.options;

        await writeFile(`${this.tempPath}/src/App.${srcPath}`, appTemplate(styleExt, redux));
        await writeFile(`${this.tempPath}/src/index.${srcPath}`, indexTemplate(styleExt, redux));

        if (redux) {
          ensureDirExists(path.join(this.tempPath,
            this.options.reduxPath));

          ensureDirExists(path.join(this.tempPath,
            this.options.reduxPath,
            this.options.reducerPath));

          await writeFile(path.join(this.tempPath,
            this.options.reduxPath,
            this.options.reducerPath,
            'rootReducer.js'), rootReducer());

          copy(`${this.boilerPath}/reduxStore`, path.join(this.tempPath, this.options.reduxPath),
            (err) => {
              if (err) {
                reject(err);
              } else {
                resolve(true);
              }
            });
        } else {
          resolve(true);
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  addStyle() {
    return new Promise(async (resolve, reject) => {
      try {
        const { styleExt } = this.options;
        await writeFile(`${this.tempPath}/src/App.${styleExt}`, appStyle);
        await writeFile(`${this.tempPath}/src/index.${styleExt}`, indexStyle);
        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  }

  addPackage() {
    return new Promise((resolve, reject) => {
      const style = this.options.styleExt === 'css' ? 'base' : 'sass';
      const redux = this.options.redux ? 'redux/' : '';
      const pkgPath = `${redux}${style}`;

      copy(`${this.boilerPath}package/${pkgPath}`, this.tempPath, (err) => {
        if (err) {
          reject(err);
        } else {
          replace({
            files: `${this.tempPath}package.json`,
            from: /(---name---)/gm,
            to: this.options.name,
          },
            (err, _) => { // eslint-disable-line
            if (err) {
              reject(err);
            } else {
              resolve(true);
            }
          });
        }
      });
    });
  }

  finalize() {
    return new Promise((resolve, reject) => {
      process.stdout.write('finalizing project\n');
      copy(this.tempPath, this.destination, (err) => {
        if (err) {
          reject(err);
        } else {
          process.stdout.write('cleaning up temporary files\n');
          rmdir(this.tempPath, async (err) => { // eslint-disable-line
            if (err) {
              reject(err);
            } else {
              try {
                await shell(`mkdir ${path.join(this.destination, this.options.componentPath)}`);

                if (this.options.redux) {
                  await shell(`mkdir ${path.join(this.destination, this.options.reduxPath, this.options.actionPath)}`);
                }

                await shell(`git -C ${this.destination} init`);
                await shell(`git -C ${this.destination} add .`);
                await shell(`git -C ${this.destination} commit -m '- Generated using Partum-React'`);

                process.stdout.write(
                  `\nrunning npm install inside ${this.destination}\n`,
                );
                await npmInstall(this.destination, this.silent);

                resolve(true);

              } catch (err) { // eslint-disable-line
                reject(err);
              }
            }
          });
        }
      });
    });
  }
};
