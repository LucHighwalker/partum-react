module.exports = `

Commands:
\t-h, --help:       Displays this help message.
\t-v, --version:    Displays the current installed version of partum-react.
\t-i, --init:       Initializes partum in a current react project directory.
\t-c, --component:  Create a new react component.
\t-a, --action:     Create a new action in a redux enabled project. 

Usage:
 $ partum [project name]
 Creates a new react project with options (default):
\t  redux (false): Enables redux support.
\t  js (false): Uses the js file format instead of jsx.
\t  scss || sass (css): Uses scss or sass for stylesheets respectively.

 $ partum -c [component name] [state key]=[state value]
 Generates a new react component with options (default):
\t  -f, --func, --functional (false): Generates a functional component instead of a class component.
\t  [state key]=[state value]: Optional, adds states to the component.

 $ partum -a [action name] [action file] [reducer file]
 Generates a new action with the options (default):
\t  [action file] (action.js): Specifies which action folder to add the action.
\t  [reducer file] (reducer.js): Specifies which reducer file to add the action dispatch to.


`;
