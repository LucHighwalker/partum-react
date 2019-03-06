## Create a New Component

New components can be generated using `partum --component [component name]`. There must be a component folder present in the projects src/ folder.
By default, a class component will be generated. You can create functional components by passing in the `--func` option.
To add states, pass in states in this format `[state key]=[state value]`. This can only be done with class components. 

### Example

Using jsx and scss

```
partum --component exampleComponent aState=\'this is a state\' anotherState=true oneMore=215
```

Output
```/src/component/exampleComponent/exampleComponent.jsx
import React, { Component } from 'react';
import './exampleComponent.scss'

class ExampleComponent extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
			aState: 'this is a state',
			anotherState: true,
			oneMore: 215
		}
  }


  render() {
    return (
      <div className='exampleComponent'>
        <p>exampleComponent works!</p>
      </div>
    );
  }
}

export default ExampleComponent;
```

```/src/component/exampleComponent/exampleComponent.scss
.exampleComponent {
  padding: 5px;
  border: 1px solid grey;
  border-radius: 5px;
}

```