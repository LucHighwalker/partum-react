#!/usr/bin/env node
const sys = require('child_process');
const exec = sys.exec;

const package = JSON.parse(JSON.stringify(require('./package.json')));

const Options = require('./src/options');
const HelpMsg = require('./src/helpMsg');

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
    const command = args[0] ? args[0] : 'react-app';
    switch (command) {
      case '-v':
      case '--version':
        console.log(`Partum-React version: ${package.version}`);
        break;

      case '-h':
      case '--help':
        console.log(HelpMsg);
        break;

      case '-i':
      case '--init':
        const destination = process.cwd();
        const destArr = destination.split('/');
        name = destArr[destArr.length - 1];
        options = new Options(name);
        options.processArgs(args);
        options.save();
        break;

      default:
        if (command[0] === '-') {
          throw new Error(
            `Invalid command [${command}]. Use 'partum --help' for a list of commands.`
          );
        }
        name = command;
        options = new Options(name);
        options.processArgs(args);
        options.save();
    }
  } catch (error) {
    console.error(error);
  }
}

main();
