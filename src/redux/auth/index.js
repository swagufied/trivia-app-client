import actions from './actions';
import AuthToken from "../../utils/tokenManagement"
// import { browserHistory } from 'react-router'

export default dispatch => () => {

	// verify token
	dispatch(actions.authenticatingUser());


	AuthToken.verify().then( data => {

		// update user information in redux
		console.log('auth index', data)
		dispatch(actions.setUser(data.user))
		dispatch(actions.authenticatedUser());
	}).catch(error => {
		console.log('token verify error catch', error);
		dispatch(actions.error(error))
	});	


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

export {
	refreshAuth,
	authenticateUser
}