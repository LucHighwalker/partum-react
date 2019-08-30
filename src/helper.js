const fs = require('fs');
const sys = require('child_process');

const pkg = JSON.parse(JSON.stringify(require('../package.json')));

const loading = require('./loading');

const UpdateMsg = require('./messages/update');

const { exec, spawn } = sys;

const capitalize = string => string.charAt(0).toUpperCase() + string.slice(1);

const upperCase = string => string.toUpperCase();

const stateValue = (value) => {
  if (value === 'true' || value === 'false') {
    return value === 'true';
  }
  if (/[^0-9]+/.test(value)) {
    return `'${value}'`;
  }
  return value;
};

const processStates = (states) => {
  if (states.length === 0) {
    return '';
  }
  let processed = '';
  states.forEach((state) => {
    const split = state.split('=');
    processed = `${processed}\n\t\t\t${split[0]}: ${stateValue(split[1])},`;
  });
  return `\n\t\tthis.state = {${processed}\n\t\t}`;
};

const dirExists = filePath => fs.existsSync(filePath);

const ensureDirExists = (filePath) => {
  if (fs.existsSync(filePath) === false) {
    fs.mkdirSync(filePath);
  }
};

const writeFile = async (path, data) => {
  fs.writeFile(path, data, (err) => {
    if (err) throw err;
    return true;
  });
};

const shell = (command, log = false, cb = null) => new Promise((resolve, reject) => {
  exec(command, (err, stdout, stderr) => {
    if (err) reject(err);
    if (cb) cb(stdout);
    if (log) process.stdout.write(`\n${stdout}\n\n`);
    resolve({
      stdout,
      stderr,
    });
  });
});

const npmInstall = (path, silent, cb = null) => new Promise(async (resolve, reject) => {
  if (silent) {
    try {
      loading.startLoading();
      await shell(`npm install --prefix ${path}`, true, () => {
        loading.stopLoading();
      });
      resolve();
    } catch (err) {
      reject(err);
    }
  } else {
    const install = spawn('npm', ['install', '--loglevel=info', '--no-spin', '--prefix', path]);

    install.stdout.on('data', data => process.stdout.write(data));

    install.stderr.on('data', data => process.stderr.write(data));

    install.on('exit', () => {
      if (cb) cb();
      resolve();
    });
  }
});

const checkUpdate = async () => {
  await shell('npm view partum-react version', false, (ver) => {
    const version = ver.trim();
    if (pkg.version !== version) {
      process.stdout.write(UpdateMsg(pkg.version, version));
    }
  });
};

module.exports = {
  capitalize,
  upperCase,
  stateValue,
  processStates,
  dirExists,
  ensureDirExists,
  writeFile,
  shell,
  npmInstall,
  checkUpdate,
};
