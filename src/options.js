const fs = require('fs');
const path = require('path');

const inquirer = require('inquirer');
const { initPrompts, reduxPrompts } = require('./messages/prompts');

const helper = require('./helper');

module.exports = class Options extends Object {
  constructor(name, load = false) {
    super();
    this.name = name;

    if (load) this.loadOptions();
  }

  loadOptions() {
    const optionsPath = path.join(process.cwd(), 'partum.json');
		const options = JSON.parse(JSON.stringify(require(optionsPath))); // eslint-disable-line
    this.assignValues(options);
  }

  assignValues(values) {
    const keys = Object.keys(values);
    for (let i = 0; i < keys.length; i += 1) {
      this[keys[i]] = values[keys[i]];
    }
  }

  askQuestion() {
    return new Promise((resolve, reject) => {
      inquirer
        .prompt(initPrompts)
        .then((answers) => {
          if (answers.redux === true) {
            inquirer
              .prompt(reduxPrompts)
              .then((reduxAnswers) => {
                const allAnswers = Object.assign(answers, reduxAnswers);
                this.assignValues(allAnswers);
                resolve(allAnswers);
              })
              .catch(error => reject(error));
          } else {
            this.assignValues(answers);
            resolve(answers);
          }
        })
        .catch(error => reject(error));
    });
  }

  save() {
    const currentDir = process.cwd();
    const currDirArr = currentDir.split('/');
    const currDirName = currDirArr[currDirArr.length - 1];
    const filePath = this.name === currDirName ? currentDir : `${currentDir}/${this.name}`;
    const copy = Object.assign({}, this);

    copy.silent = undefined;

    helper.ensureDirExists(filePath);
    fs.writeFile(`${filePath}/partum.json`, JSON.stringify(copy, null, 2), (err) => {
      if (err) throw err;
    });
  }
};
