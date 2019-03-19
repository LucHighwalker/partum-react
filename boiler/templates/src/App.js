module.exports = (styleExt, redux = false) => (redux === false ? `import React, { Component } from 'react';
import logo from './logo.svg';
import './App.${styleExt}';

class App extends Component {
\trender() {
\t\treturn (
\t\t\t<div className="App">
\t\t\t\t<header className="App-header">
\t\t\t\t\t<img src={logo} className="App-logo" alt="logo" />
\t\t\t\t\t<p>
\t\t\t\t\t\tEdit <code>src/App.jsx</code> and save to reload.
\t\t\t\t\t</p>
\t\t\t\t\t<a
\t\t\t\t\t\tclassName="App-link"
\t\t\t\t\t\thref="https://reactjs.org"
\t\t\t\t\t\ttarget="_blank"
\t\t\t\t\t\trel="noopener noreferrer"
\t\t\t\t\t>
\t\t\t\t\t\tLearn React
\t\t\t\t\t</a>
\t\t\t\t</header>
\t\t\t</div>
\t\t);
\t}
}

export default App;
` : `import React, { Component } from "react";
import { connect } from "react-redux";

import logo from "./logo.svg";
import "./App.${styleExt}";

class App extends Component {
\trender() {
\t\treturn (
\t\t\t<div className="App">
\t\t\t\t<header className="App-header">
\t\t\t\t\t<img src={logo} className="App-logo" alt="logo" />
\t\t\t\t\t<p>
\t\t\t\t\t\tEdit <code>src/App.jsx</code> and save to reload.
\t\t\t\t\t</p>
\t\t\t\t\t<a
\t\t\t\t\t\tclassName="App-link"
\t\t\t\t\t\thref="https://reactjs.org"
\t\t\t\t\t\ttarget="_blank"
\t\t\t\t\t\trel="noopener noreferrer"
\t\t\t\t\t>
\t\t\t\t\t\tLearn React
\t\t\t\t\t</a>
\t\t\t\t</header>
\t\t\t</div>
\t\t);
\t}
}

const mapStateToProps = state => ({
\t...state
});

export default connect(mapStateToProps)(App);
`);
