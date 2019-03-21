module.exports = (actionType, prevActions = '', returnState = 'state', defState = {}) => `export default (state = ${JSON.stringify(defState, null, 1)}, action) => {
\tswitch (action.type) {${prevActions}
\t\tcase '${actionType}':
\t\t\treturn ${returnState}

\t\tdefault:
\t\t\treturn state
\t}
}
`;
