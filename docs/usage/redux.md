## Redux

### Create an action

New actions can be generated using `partum --action [action name]`. Creating a new action will generate the proper action, reducer, and add the reducer to the store. However, you will still need to manually hook up your dispatches to components using the action, as well as specify what the action does.
By default, actions will be added to `/src/redux/actions/action.js` and reducers will be added to `/src/redux/reducers/reducer.js`.
You can specify specific action and reducer files using optional paramters `partum --action [action name] [action file] [reducer file]`.

#### Example

```
partum --action aNewAction actionfile reducerfile
```

Output: 

```/src/redux/actions/actionfile.js
export const aNewAction = () => dispatch => {
	dispatch({
		type: 'ANEWACTION',
		payload: 'result_of_aNewAction',
	});
};

```

```/src/redux/reducers/reducerfile.js
export default (state = {}, action) => {
	switch (action.type) {
		case 'ANEWACTION':
			return state

		default:
			return state
	}
};

```

```/src/redux/reducers/rootReducer.js
import {
	combineReducers
} from 'redux';
import reducerfile from './reducerfile';

export default combineReducers({
	reducerfile,
});

```
