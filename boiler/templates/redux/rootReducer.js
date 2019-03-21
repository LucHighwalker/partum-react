module.exports = (imports = '', reducers = '') => `import {
\tcombineReducers
} from 'redux';${imports}

export default combineReducers({${reducers}});`;
