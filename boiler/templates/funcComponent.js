module.exports = (name, funcName, styleExt) => {
    return `import React, { Component } from 'react';
import './${name}.${styleExt}';
    
function ${funcName}(props){
    return (
        <div className='${name}'>
            <p>${name} works!</p>
        </div>
    );
}
  
export default ${funcName};
`;
};