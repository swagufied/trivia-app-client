import actions from './actions';
import {store} from 'redux/configureStore';



const dispatch = store.dispatch;


const dispatchAuthenticateUser = () => {
	dispatch(actions.authenticateUser())
}

const dispatchResetAuth = () => {
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
	dispatchResetAuth,
	dispatchSetUser,
	dispatchAuthenticationError
}

