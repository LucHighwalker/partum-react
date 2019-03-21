module.exports = (name, funcName, styleExt, redux = false) => (redux === false ? `import React from 'react';
import './${name}.${styleExt}';

function ${funcName}(props) {
\treturn (
\t\t<div className="${name}">
\t\t\t<p>${name} works!</p>
\t\t</div>
\t);
}

export default ${funcName};
` : `import React from 'react';
import { connect } from "react-redux";
import './${name}.${styleExt}';

function ${funcName}(props) {
\treturn (
\t\t<div className="${name}">
\t\t\t<p>${name} works!</p>
\t\t</div>
\t);
}

const mapStateToProps = state => ({
\t...state
});

const mapDispatchToProps = dispatch => ({
\t// your dispatches go here.
});

export default connect(mapStateToProps, mapDispatchToProps)(${funcName});
`);
