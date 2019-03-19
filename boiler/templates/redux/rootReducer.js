module.exports = (reducerImports = '', reducers = '') => `import {
\tcombineReducers
} from 'redux';${reducerImports}

export default combineReducers({${reducers}});`;
