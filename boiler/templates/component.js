module.exports = (name, className, styleExt, state = null) => {
  const constructor = state === null ? '' : `
  constructor(props) {
    super(props);
    ${state}
  }

`;

  return `import React, { Component } from 'react';
import './${name}.${styleExt}'

class ${className} extends Component {${constructor}
  render() {
    return (
      <div className='${name}'>
        <p>${name} works!</p>
      </div>
    );
  }
}

export default ${className};
`;
};