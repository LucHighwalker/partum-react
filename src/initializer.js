const path = require('path');
const sys = require('child_process');
const exec = sys.exec;

const copy = require('ncp').ncp;
const replace = require('replace-in-file');
const rmdir = require('rimraf');

async function sh(cmd) {
  return new Promise(function(resolve, reject) {
    exec(cmd, (err, stdout, stderr) => {
      if (err) {
        reject(err);
      } else {
        resolve({ stdout, stderr });
      }
    });
  });
}

module.exports = class Initializer {
  constructor(options, destination) {
    this.options = options;
    this.boilerPath = path.join(__dirname, '../boiler/');
    this.tempPath = path.join(__dirname, '../_temp/');
    this.destination = destination;

    rmdir(this.tempPath, err => {
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
      copy(this.boilerPath + 'main', this.tempPath, err => {
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
    return new Promise((resolve, reject) => {
      const srcPath = this.options.jsx ? 'jsx' : 'js';
      copy(this.boilerPath + srcPath, this.tempPath, err => {
        if (err) {
          reject(err);
        } else {
          if (this.options.styleExt !== 'css') {
            replace(
              {
                files: [
                  `${this.tempPath}/src/App.${srcPath}`,
                  `${this.tempPath}/src/index.${srcPath}`
                ],
                from: /(.css)/gm,
                to: `.${this.options.styleExt}`
              },
              (err, _) => {
                if (err) {
                  reject(err);
                } else {
                  resolve(true);
                }
              }
            );
          } else {
            resolve(true);
          }
        }
      });
    });
  }

  addStyle() {
    return new Promise((resolve, reject) => {
      const stylePath = `styles/${this.options.styleExt}`;
      copy(this.boilerPath + stylePath, this.tempPath, err => {
        if (err) {
          reject(err);
        } else {
          resolve(true);
        }
      });
    });
  }

  addPackage() {
    return new Promise((resolve, reject) => {
      const pkgPath = this.options.styleExt === 'css' ? 'base' : 'sass';
      copy(this.boilerPath + 'package/' + pkgPath, this.tempPath, err => {
        if (err) {
          reject(err);
        } else {
          replace({
            files: this.tempPath + 'package.json',
            from: /(---name---)/gm,
            to: this.options.name
          }, (err, _) => {
            if (err) {
              reject(err);
            } else {
              resolve(true);
            }
          })
        }
      });
    });
  }

  finalize() {
    return new Promise((resolve, reject) => {
      copy(this.tempPath, this.destination, err => {
        if (err) {
          reject(err);
        } else {
          rmdir(this.tempPath, async err => {
            if (err) {
              reject(err);
            } else {
              try {
                await sh(`mkdir ${this.destination}/src/components`);
                resolve(true);
              } catch (err) {
                reject(err)
              }
            }
          });
        }
      });
    });
  }
};
