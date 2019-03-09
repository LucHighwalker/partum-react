const fs = require('fs');

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

module.exports = {
  ensureDirExists,
  stateValue
}