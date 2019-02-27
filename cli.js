#!/usr/bin/env node
const sys = require('child_process');
const exec = sys.exec;

const package = JSON.parse(JSON.stringify(require('./package.json')));

const Options = require('./options');
const HelpMsg = require('./helpMsg');

const [, , ...args] = process.argv;

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

async function main() {
  try {
    let name = '';
    let destination = '';
    const command = args[0] ? args[0] : 'react-app';
    switch (command) {
      case '-h':
      case '--help':
        console.log(HelpMsg);
        break;

      case '-i':
      case '--init':
        destination = process.cwd();
        const destArr = destination.split('/');
        name = destArr[destArr.length - 1];
        break;

      default:
        if (command[0] === '-') {
          throw new Error(`Invalid command [${command}]. Use 'partum --help' for a list of commands.`);
        }
        name = command;
        destination = `${process.cwd()}/${name}`;
    }
    options = new Options(name, destination);
    options.processArgs(args);
  } catch (error) {
    console.error(error);
  }
}

main();
