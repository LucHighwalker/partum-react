const fs = require('fs');
const sys = require('child_process');

const {
  exec,
} = sys;

function ensureDirExists(filePath) {
  if (fs.existsSync(filePath)) {
    return;
  }
  fs.mkdirSync(filePath);
}

function stateValue(value) {
  if (value === 'true' || value === 'false') {
    return value === 'true';
  }
  if (/[^0-9]+/.test(value)) {
    return `'${value}'`;
  }
  return value;
}

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function upperCase(string) {
  return string.toUpperCase();
}

function processStates(states) {
  if (states.length === 0) {
    return '';
  }
  let processed = '';
  for (let i = 0; i < states.length; i += 1) {
    const split = states[i].split('=');
    const value = stateValue(split[1]);
    processed = `${processed}\n\t\t\t${split[0]}: ${value},`;
  }
  return `\n\t\tthis.state = {${processed}\n\t\t}`;
}

function writeFile(path, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, data, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(true);
      }
    });
  });
}

function shell(command, log = false, cb = null) {
  return new Promise(((resolve, reject) => {
    exec(command, (err, stdout, stderr) => {
      if (err) {
        reject(err);
      } else {
        if (cb) cb();
        if (log) process.stdout.write(`\n${stdout}\n\n`);
        resolve({
          stdout,
          stderr,
        });
      }
    });
  }));
}

module.exports = {
  ensureDirExists,
  stateValue,
  capitalize,
  upperCase,
  processStates,
  writeFile,
  shell,
};
