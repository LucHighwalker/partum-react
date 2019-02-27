#!/usr/bin/env node
const sys = require('child_process');
const exec = sys.exec;

const package = JSON.parse(JSON.stringify(require('./package.json')));

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
    const name = args[0] ? args[0] : 'ts-node-startertest';
    args.shift();
    const destination = `${process.cwd()}/${name}`;
    const options = {
      name,
      destination,
      jsx: false,
      redux: false,
      styleExt: 'css',
      components: []
    }
    console.log(options);
  } catch (error) {
    console.error(error);
  }
}

main();
