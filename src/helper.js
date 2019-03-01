const fs = require('fs');

function ensureDirExists(filePath) {
  if (fs.existsSync(filePath)) {
    return true;
  }
  fs.mkdirSync(filePath);
}

module.exports = {
  ensureDirExists
}