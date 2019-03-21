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
    -a, --action:     Create a new action in a redux enabled project. 

Usage:
 $ partum [project name]
 Creates a new react project with options (default):
      redux (false): Enables redux support.
      js (false): Uses the js file format instead of jsx.
      scss || sass (css): Uses scss or sass for stylesheets respectively.

 $ partum -c [component name] [state key]=[state value]
 Generates a new react component with options (default):
      -f, --func, --functional (false): Generates a functional component instead of a class component.
      [state key]=[state value]: Optional, adds states to the component.

 $ partum -a [action name] [action file] [reducer file]
 Generates a new action with the options (default):
      [action file] (action.js): Specifies which action folder to add the action.
      [reducer file] (reducer.js): Specifies which reducer file to add the action dispatch to.
```

# Usage

[new_proj](/usage/new_proj.md ':include')

[init_proj](/usage/init_proj.md ':include')

[new_comp](/usage/new_comp.md ':include')

[redux](/usage/redux.md ':include')
