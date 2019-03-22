/* eslint-disable arrow-body-style */
module.exports = (actionType, prevActions = '', returnState = '{\n\t\t\t\tresult: action.payload,\n\t\t\t}\n', defState = {}) => {
  return `export default (state = ${JSON.stringify(defState, null, 1)}, action) => {
\tswitch (action.type) {${prevActions}
\t\tcase '${actionType}':
\t\t\treturn ${returnState}

\t\tdefault:
\t\t\treturn state
\t}
}
`;
};
/* eslint-enable arrow-body-style */
