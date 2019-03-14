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
  if (value === 'true' || value === 'false') {
    return value === 'true' ? true : false;
  } else if (/[^0-9]+/.test(value)) {
    return `'${value}'`
  }
  return value
}

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function shell(command, log = false, cb = null) {
  return new Promise(function (resolve, reject) {
    exec(command, (err, stdout, stderr) => {
      if (err) {
        reject(err);
      } else {
        if (cb) cb();
        if (log) process.stdout.write(`\n${stdout}\n\n`);
        resolve({
          stdout,
          stderr
        });
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