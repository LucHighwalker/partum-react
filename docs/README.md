**(WIP)**

I wasn't a fan of the react clis out there, so I made my own.


# Installation

```
npm install -g partum-react
```

# Quick Start

Can be pulled up using `partum -h` or `partum --help`.

```
Commands:
        -h, --help:       Displays this help message.
        -v, --version:    Displays the current installed version of partum-react.
        -i, --init:       Initializes partum in a current react project directory.
        -c, --component:  Create a new react component.

Usage:
        $ partum [project name]
         Creates a new react project with options (default):
          redux (false): Enables redux support.
          js (false): Uses the js file format instead of jsx.
          scss || sass (css): Uses scss or sass for stylesheets respectively.

        $ partum --component [component name] [state key]=[state value]
         Generates a new react component with options (default):
          -f, --func, --functional (false): Generates a functional component instead of a class component.
          [state key]=[state value]: Optional, adds states to the component. Strings must have their quotations escaped.
```

# Usage

## Creating a New Project

You can create a new project in the current directory by using `partum [project name]`.
This supports the following options input after the project name and separated by spaces.
```
  option   (default):   Description.
------------------------------------------------------------------------------
  redux    (false):     Enables redux support. (Currently in development)
  js       (false):     Uses js files instead of jsx... But why would you?
  scss     (css):       Uses scss files for styling.
  sass     (css):       Uses sass files for styling.
```

## Initialize Existing Project

Partum requires a partum.json file inside the project's root directory in order to generate components and actions.
For existing projects can be done manually or by using `partum --init`.
This accepts the same options as creating a new project.

```partum.json
{
  "name": "example",
  "jsx": true,
  "redux": false,
  "styleExt": "scss"
}
```

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