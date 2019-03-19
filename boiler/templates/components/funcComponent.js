module.exports = (name, funcName, styleExt) => `import React from 'react';
import './${name}.${styleExt}';

function ${funcName}(props) {
\treturn (
\t\t<div className="${name}">
\t\t\t<p>${name} works!</p>
\t\t</div>
\t);
}

export default ${funcName};\n`;
