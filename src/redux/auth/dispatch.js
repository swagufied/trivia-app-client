import actions from './actions';
// import { browserHistory } from 'react-router'
import {store} from 'redux/configureStore';



const dispatch = store.dispatch;


const dispatchAuthenticateUser = () => {
	console.log('dispatch authenticateUser')
	dispatch(actions.authenticateUser())
}

const dispatchRefreshAuth = () => {
	dispatch(actions.refresh())
}

const dispatchAuthenticationError = () => {
	dispatch(actions.error())
}

const dispatchSetUser = dispatch => (user) => {
	dispatch(actions.setUser({
		'data': user
	}))
}

export {
	dispatchAuthenticateUser,
	dispatchRefreshAuth,
	dispatchSetUser,
	dispatchAuthenticationError
}

