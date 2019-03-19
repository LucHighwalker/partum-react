module.exports = (styleExt, redux = false) => (redux === false ? `import React from 'react';
import ReactDOM from 'react-dom';
import './index.${styleExt}';
import App from './App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
` : `import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import configureStore from "./redux/store";

import "./index.${styleExt}";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

ReactDOM.render(
\t<Provider store={configureStore()}>
\t\t<App />
\t</Provider>,
\tdocument.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
`);
