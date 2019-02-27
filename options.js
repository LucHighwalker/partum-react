const fs = require('fs');

module.exports = class Options extends Object {
  constructor(name, options = {}) {
    super();
    this.name = name;
    this.jsx = false;
    this.redux = false;
    this.styleExt = 'css';
    for (var attr in options) {
      this[attr] = options[attr];
    }
  }

  processArgs(args) {
    for (let i = 1; i < args.length; i++) {
      switch (args[i]) {
        case 'redux':
          this.redux = true;
          break;

        case 'jsx':
          this.jsx = true;
          break;

        case 'scss':
          this.styleExt = 'scss';
          break;

        case 'sass':
          this.styleExt = 'sass';
          break;

        default:
          throw new Error(
            `Invalid option [${
              args[i]
            }]. Use 'partum --help' for a list of options.`
          );
      }
    }
  }

  save() {
    const currentDir = process.cwd();
    const currDirArr = currentDir.split('/');
    const currDirName = currDirArr[currDirArr.length - 1];
    const filePath =
      this.name === currDirName ? currentDir : `${currentDir}/${this.name}`;

    this.ensureDirExists(filePath);
    fs.writeFile(
      `${filePath}/partum.json`,
      JSON.stringify(this, null, 2),
      err => {
        if (err) throw err;
      }
    );
  }

  ensureDirExists(filePath) {
    if (fs.existsSync(filePath)) {
      return true;
    }
    fs.mkdirSync(filePath);
  }
};
