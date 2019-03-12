const fs = require('fs');
const sys = require('child_process');
const exec = sys.exec;

function ensureDirExists(filePath) {
  if (fs.existsSync(filePath)) {
    return true;
  }
  fs.mkdirSync(filePath);
}

function stateValue(value) {
  if (value === true || value === false) {
    return value;
  } else if (/[A-Za-z]+/.test(value)) {
    return `'${value}'`
  }
}

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function shell(command, log = false) {
  return new Promise(function(resolve, reject) {
    exec(command, (err, stdout, stderr) => {
      if (err) {
        reject(err);
      } else {
        if (log) process.stdout.write(`\n\n${stdout}\n\n`);
        resolve({ stdout, stderr });
      }
    });
  });
}

module.exports = {
  ensureDirExists,
  stateValue,
  capitalize,
  shell
}