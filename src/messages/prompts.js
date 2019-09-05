const path = require('path');

const initPrompts = [
  {
    type: 'confirm',
    name: 'jsx',
    message: 'Use jsx file extension?',
    default: true,
  },
  {
    type: 'input',
    name: 'componentPath',
    message: 'Where should components be stored?',
    default: '/src/components',
    filter: (val) => {
      const split = val.split('/');
      return path.join.apply(null, split);
    },
  },
  {
    type: 'confirm',
    name: 'componentFolders',
    message: 'Should components have their own folders?',
    default: true,
  },
  {
    type: 'list',
    name: 'styleExt',
    message: 'Choose default style extension.',
    choices: ['CSS', 'SCSS', 'SASS'],
    filter(val) {
      return val.toLowerCase();
    },
  },
  {
    type: 'confirm',
    name: 'redux',
    message: 'Use redux?',
    default: false,
  },
];

const reduxPrompts = [
  {
    type: 'input',
    name: 'reduxPath',
    message: 'Where should redux live?',
    default: '/src/redux',
    filter: (val) => {
      const split = val.split('/');
      return path.join.apply(null, split);
    },
  },
  {
    type: 'input',
    name: 'actionPath',
    message: 'Within the redux path, where should actions be stored?',
    default: '/actions',
    filter: (val) => {
      const split = val.split('/');
      return path.join.apply(null, split);
    },
  },
  {
    type: 'input',
    name: 'reducerPath',
    message: 'What about reducers?',
    default: '/reducers',
    filter: (val) => {
      const split = val.split('/');
      return path.join.apply(null, split);
    },
  },
];

module.exports = {
  initPrompts,
  reduxPrompts,
};
