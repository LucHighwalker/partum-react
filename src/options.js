const fs = require('fs');

const helper = require('./helper');

module.exports = class Options extends Object {
  constructor(name, options = {}) {
    super();
    this.name = name;
    this.jsx = true;
    this.redux = false;
    this.styleExt = 'css';
    this.componentFolders = true;
    this.componentPath = '/src/components/';

    this.silent = false;

    const keys = Object.keys(options);
    for (let i = 0; i < keys.length; i += 1) {
      this[keys[i]] = options[keys[i]];
    }

    if (this.redux) {
      this.reduxPath = '/src/redux/';
      this.actionPath = '/actions/';
      this.reducerPath = '/reducers/';
    }
  }

  processArgs(args) {
    for (let i = 1; i < args.length; i += 1) {
      switch (args[i]) {
        case 'redux':
          this.redux = true;
          this.reduxPath = '/src/redux/';
          this.actionPath = '/actions/';
          this.reducerPath = '/reducers/';
          break;

        case 'js':
          this.jsx = false;
          break;

        case 'scss':
          this.styleExt = 'scss';
          break;

        case 'sass':
          this.styleExt = 'sass';
          break;

        case '-s':
        case '--silent':
          this.silent = true;
          break;

        default:
          throw new Error(
            `Invalid option [${
              args[i]
            }]. Use 'partum --help' for a list of options.`,
          );
      }
    }
  }

  save() {
    const currentDir = process.cwd();
    const currDirArr = currentDir.split('/');
    const currDirName = currDirArr[currDirArr.length - 1];
    const filePath = this.name === currDirName ? currentDir : `${currentDir}/${this.name}`;
    const options = this;
    options.silent = undefined;

    helper.ensureDirExists(filePath);
    fs.writeFile(
      `${filePath}/partum.json`,
      JSON.stringify(options, null, 2),
      (err) => {
        if (err) throw err;
      },
    );
  }
};
