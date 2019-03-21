module.exports = (name, className, styleExt, states = '', redux = false) => (redux === false ? `import React, { Component } from 'react';
import './${name}.${styleExt}';

class ${className} extends Component {
\tconstructor(props) {
\t\tsuper(props);
    
\t\t// states go here.${states}
\t}

\trender() {
\t\treturn (
\t\t\t<div className='${name}'>
\t\t\t\t<p>${name} works!</p>
\t\t\t</div>
\t\t);
\t}
}

export default ${className};
` : `import React, { Component } from 'react';
import { connect } from "react-redux";
import './${name}.${styleExt}';

class ${className} extends Component {
\tconstructor(props) {
\t\tsuper(props);
    
\t\t// states go here.${states}
\t}

\trender() {
\t\treturn (
\t\t\t<div className='${name}'>
\t\t\t\t<p>${name} works!</p>
\t\t\t</div>
\t\t);
\t}
}

const mapStateToProps = state => ({
\t...state
});

const mapDispatchToProps = dispatch => ({
\t// your dispatches go here.
});

export default connect(mapStateToProps, mapDispatchToProps)(${className});
`);
