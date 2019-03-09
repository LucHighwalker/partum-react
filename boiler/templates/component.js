module.exports = (name, className, styleExt, state = '') => {
  return `import React, { Component } from 'react';
import './${name}.${styleExt}';

class ${className} extends Component {
\tconstructor(props) {
\t\tsuper(props);
    
\t\t// states go here.${state}
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
};