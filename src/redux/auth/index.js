import actions from './actions';
// import { browserHistory } from 'react-router'
import {store} from '../configureStore';

// check verification status of user and refreshes token if necessary
// export default dispatch => () => {

// 	// verify token
// 	dispatch(actions.authenticatingUser());






// 	AuthToken.verify().then( data => {

// 		// update user information in redux
// 		console.log('auth index', data)
// 		dispatch(actions.setUser(data.user))
// 		dispatch(actions.authenticatedUser());
// 	}).catch(error => {
// 		console.log('token verify error catch', error);
// 		dispatch(actions.error(error))
// 	});	


// }

const dispatch = store.dispatch;

function AuthenticationActions() {

	const authenticatingUser = () => dispatch(actions.authenticatingUser());
	const authenticateUser = () => dispatch(actions.authenticateUser());
	const error = () => dispatch(actions.error());

}


const authenticateUser = dispatch => () => {
	dispatch(actions.authenticatedUser());
	console.log('sss')
}



const refreshAuth = dispatch => () => {
	dispatch(actions.refresh())
}

const setUser = dispatch => (user) => {
	dispatch(actions.setUser({
		'data': user
	}))
}

export default {
	refresh: refreshAuth
}