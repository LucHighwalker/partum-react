module.exports = `

Commands:
\t-h, --help:       Displays this help message.
\t-v, --version:    Displays the current installed version of partum-react.
\t-i, --init:       Initializes partum in a current react project directory.
\t-c, --component:  Create a new react component.

Usage:
\t$ partum [project name]
\t Creates a new react project with options (default):
\t  redux (false): Enables redux support.
\t  js (false): Uses the js file format instead of jsx.
\t  scss || sass (css): Uses scss or sass for stylesheets respectively.

\t$ partum -c [component name] [state key]=[state value]
\t Generates a new react component with options (default):
\t  -f, --func, --functional (false): Generates a functional component instead of a class component.
\t  [state key]=[state value]: Optional, adds states to the component.


`