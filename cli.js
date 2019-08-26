#!/usr/bin/env node

const pkg = JSON.parse(JSON.stringify(require('./package.json')));

const Generator = require('./src/generator');
const Initializer = require('./src/initializer');
const Options = require('./src/options');
const { shell } = require('./src/helper');

const ErrorHandler = require('./src/errorHandler');

const HelpMsg = require('./src/messages/help');
const UpdateMsg = require('./src/messages/update');

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
        process.stdout.write('Opening https://luchighwalker.github.io/partum-react/#/\n');
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
        options.processArgs(args);
        options.save();
        break;

      case '-v':
      case '--version':
        shell('npm view partum-react version', false, (version) => {
          if (pkg.version !== version) {
            process.stdout.write(`Partum-React version(outdated): ${pkg.version}\navailable version: ${version}`);
          } else {
            process.stdout.write(`Partum-React version(up to date): ${pkg.version}`);
          }
        });
        break;

      default:
        if (command[0] === '-') {
          throw new Error(
            `Invalid command [${command}]. Use 'partum --help' for a list of commands.`,
          );
        }

        await shell('npm view partum-react version', false, (version) => {
          if (pkg.version !== version) {
            process.stdout.write(UpdateMsg(pkg.version, version));
          }
        });

        name = command;
        destination = `${process.cwd()}/${name}`;
        options = new Options(name);

				let silent = options.processArgs(args); // eslint-disable-line
				const initializer = new Initializer(options, destination, silent); // eslint-disable-line
        await initializer.initializeProject();
        process.stdout.write(
          `initialized ${name} in ${destination}\n\nnext steps:\n\t'cd ${name}'\n\t'npm start'\n`,
        );
    }
  } catch (error) {
    ErrorHandler(error);
  }
};

main();
