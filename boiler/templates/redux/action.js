module.exports = (actionName, actionType) => `export const ${actionName} = () => dispatch => {
\tdispatch({
\t\ttype: '${actionType}',
\t\tpayload: 'result_of_${actionName}',
\t});
}
`;
