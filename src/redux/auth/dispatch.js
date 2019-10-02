import actions from './actions';
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

const dispatchSetUser = (user) => {
	dispatch(actions.setUser(user))
}

export {
	dispatchAuthenticateUser,
	dispatchRefreshAuth,
	dispatchSetUser,
	dispatchAuthenticationError
}

