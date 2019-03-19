module.exports = (name, className, styleExt, states = '') => `import React, { Component } from 'react';
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
`;
