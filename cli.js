#!/usr/bin/env node
const sys = require('child_process');
const exec = sys.exec;

const copy = require('ncp').ncp;
const replace = require('replace-in-file');

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

function initializeProject(name, newProj = true) {
  options = new Options(name);
  options.processArgs(args);
  options.save();
  if (newProj) {
    const boilerPath = `${__dirname}/boiler/`;
    const filePath = `${process.cwd()}/${name}`;
    copy(boilerPath + 'main', filePath, err => {
      if (err) {
        throw err;
      } else {
        const srcPath = options.jsx ? 'jsx' : 'js';
        copy(boilerPath + srcPath, filePath, err => {
          if (err) {
            throw err;
          } else {
            const stylePath = `styles/${options.styleExt}`;
            copy(boilerPath + stylePath, filePath, err => {
              if (err) {
                throw err;
              } else {
                if (options.styleExt !== 'css') {
                  replace(
                    {
                      files: [
                        `${filePath}/src/App.${srcPath}`,
                        `${filePath}/src/index.${srcPath}`
                      ],
                      from: /(.css)/gm,
                      to: `.${options.styleExt}`
                    },
                    (err, files) => {
                      if (err) {
                        throw err;
                      } else {
                        copy(boilerPath + 'package/sass', filePath, err => {
                          if (err) {
                            throw err;
                          } else {
                            // do stuff
                          }
                        });
                      }
                    }
                  );
                } else if (options.styleExt === 'css') {
                  copy(boilerPath + 'package/base', filePath, err => {
                    if (err) {
                      throw err;
                    } else {
                      // do stuff
                    }
                  })
                }
              }
            });
          }
        });
      }
    });
  }
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
        initializeProject(name, false);
        break;

      default:
        if (command[0] === '-') {
          throw new Error(
            `Invalid command [${command}]. Use 'partum --help' for a list of commands.`
          );
        }
        name = command;
        initializeProject(name); // new project
    }
  } catch (error) {
    console.error(error);
  }
}

main();
