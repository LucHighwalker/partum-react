const path = require('path');
const copy = require('ncp').ncp;
const replace = require('replace-in-file');
const rmdir = require('rimraf');

const {
  ensureDirExists,
  writeFile,
  shell,
} = require('./helper');

const loading = require('./loading');

const appTemplate = require('../boiler/templates/src/App');
const indexTemplate = require('../boiler/templates/src/index');

const appStyle = require('../boiler/templates/styles/app');
const indexStyle = require('../boiler/templates/styles/index');

const rootReducer = require('../boiler/templates/redux/rootReducer');

module.exports = class Initializer {
  constructor(options, destination) {
    this.options = options;
    this.boilerPath = path.join(__dirname, '../boiler/');
    this.tempPath = path.join(__dirname, '../_temp/');
    this.destination = destination;

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
          ensureDirExists(`${this.tempPath}/src/redux/`);
          ensureDirExists(`${this.tempPath}/src/redux/reducers`);
          await writeFile(`${this.tempPath}/src/redux/reducers/rootReducer.js`, rootReducer());

          copy(`${this.boilerPath}/reduxStore`, this.tempPath, (err) => {
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
                await shell(`mkdir ${this.destination}/src/components`);

                if (this.options.redux) {
                  await shell(`mkdir ${this.destination}/src/redux/actions`);
                }

                process.stdout.write(
                  `\nrunning npm install inside ${this.destination}\n`,
                );
                loading.startLoading();
                await shell(
                  `npm install --prefix ${this.destination}`,
                  true,
                  () => loading.stopLoading(),
                );

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
