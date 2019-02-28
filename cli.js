#!/usr/bin/env node
const package = JSON.parse(JSON.stringify(require('./package.json')));

const Options = require('./src/options');
const Initializer = require('./src/initializer');
const HelpMsg = require('./src/helpMsg');

const [, , ...args] = process.argv;

async function main() {
  try {
    let name = '';
    let destination = '';
    let options = undefined;
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
        destination = process.cwd();
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
        destination = `${process.cwd()}/${name}`;
        options = new Options(name);
        options.processArgs(args);
        const initializer = new Initializer(options, destination);
        const initialized = await initializer.initializeProject();
        if (initialized) {
          console.log('initialized');
        }
    }
  } catch (error) {
    throw error;
  }
}

main();
