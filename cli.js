#!/usr/bin/env node
const package = JSON.parse(JSON.stringify(require('./package.json')));

const Generator = require('./src/generator');
const HelpMsg = require('./src/helpMsg');
const Initializer = require('./src/initializer');
const Options = require('./src/options');

const [, , ...args] = process.argv;

async function main() {
  try {
    let name = '';
    let destination = '';
    let options = undefined;
    const command = args[0] ? args[0] : '-h';

    switch (command) {
      case '-v':
      case '--version':
        process.stdout.write(`Partum-React version: ${package.version}\n`);
        break;

      case '-h':
      case '--help':
        process.stdout.write(HelpMsg);
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

      case '-c':
      case '--component':
        name = args[1] ? args[1] : null;
        if (name === null) {
          process.stdout.write("Component needs a name. 'partum -c [name]'\n");
        } else {
          if (/^[A-Za-z]+$/.test(name) === false) {
            process.stdout.write('Component name may not contain numbers or symbols\n');
          } else {
            const generator = new Generator();
            generator.generateComponent(args);
          }
        }
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
        await initializer.initializeProject();
        process.stdout.write(`initialized ${name} in ${destination}\n\nnext steps:\n\t'cd ${name}'\n\t'npm start'\n`);
    }
  } catch (error) {
    throw error;
  }
}

main();
