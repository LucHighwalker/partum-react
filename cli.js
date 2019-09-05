#!/usr/bin/env node

const pkg = JSON.parse(JSON.stringify(require('./package.json')));

const Generator = require('./src/generator');
const Initializer = require('./src/initializer');
const Options = require('./src/options');
const {
  dirExists, shell, checkUpdate,
} = require('./src/helper');

const ErrorHandler = require('./src/errorHandler');

const HelpMsg = require('./src/messages/help');

const [, , ...args] = process.argv;

const main = async () => {
  try {
    let name = '';
    let destination = '';
    let options;
    const command = args[0] ? args[0] : '-h';

    switch (command) {
      case '-a':
      case '--action':
        name = args[1] ? args[1] : null;
        if (name === null) {
          process.stdout.write("Action needs a name. 'partum -a [name]'\n");
        } else if (/^[A-Za-z]+$/.test(name) === false) {
          process.stdout.write('Action name may not contain numbers or symbols\n');
        } else {
          const generator = new Generator();
          generator.generateAction(args);
        }
        break;

      case '-c':
      case '--component':
        name = args[1] ? args[1] : null;
        if (name === null) {
          process.stdout.write("Component needs a name. 'partum -c [name]'\n");
        } else if (/^[A-Za-z]+$/.test(name) === false) {
          process.stdout.write('Component name may not contain numbers or symbols\n');
        } else {
          const generator = new Generator();
          generator.generateComponent(args);
        }
        break;

      case '-d':
      case '--docs':
        process.stdout.write('Opening Partum React docs...\n');
        shell('xdg-open https://luchighwalker.github.io/partum-react/#/');
        break;

      case '-h':
      case '--help':
        process.stdout.write(HelpMsg);
        break;

      case '-i':
      case '--init':
        destination = process.cwd();
				const destArr = destination.split('/'); // eslint-disable-line
        name = destArr[destArr.length - 1];
        options = new Options(name);
        await options.askQuestion();
        options.save();
        break;

      case '-v':
      case '--version':
        shell('npm view partum-react version', false, (version) => {
          if (pkg.version !== version.trim()) {
            process.stdout.write(
              `Partum-React version(outdated): ${pkg.version}\navailable version: ${version}\n`,
            );
          } else {
            process.stdout.write(`Partum-React version(up to date): ${pkg.version}\n`);
          }
        });
        break;

      default:
        if (command[0] === '-') {
          throw new Error(
            `Invalid command [${command}]. Use 'partum --help' for a list of commands.`,
          );
        }

        await checkUpdate();

        name = command;
        destination = `${process.cwd()}/${name}`;

        if (dirExists(destination)) throw new Error(`Unable to generate new project.\n${destination} already exists.`);

				const initializer = new Initializer(name, destination, false); // eslint-disable-line
        await initializer.initializeProject();
    }
  } catch (error) {
    ErrorHandler(error);
  }
};

main();
