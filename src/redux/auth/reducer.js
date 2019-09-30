import { actionsTypes } from './actions';

const initialState = {

	attemptingVerification: false,
	attemptedVerification: false,
	isAuthenticated: false,
	refresh: false,
	error: null,
	user: null,
	lastAuthenticationAttempt: Date.now()
}

const reducer = (state = initialState, { type, payload }) => {

	switch(type) {

		case actionsTypes.AUTHENTICATING_USER:

			return {
					...state,
					attemptingVerification: true,
					isAuthenticated: false,
					lastAuthenticationAttempt: Date.now()
				};
			
		case actionsTypes.AUTHENTICATE_USER:

			return {
					...state,
					attemptingVerification: false,
					attemptedVerification: true,
					isAuthenticated: true,
				};

		case actionsTypes.AUTHENTICATION_ERROR:

			return {
					...state,
					attemptingVerification: false,
					attemptedVerification: true,
					isAuthenticated: false,
					error: payload,
				};
		case actionsTypes.REFRESH_STATE:
			return initialState;

		case actionsTypes.SET_USER:
			// console.log('setting user', payload)
			return {
				...state,
				user: payload
			}

		default:
			return state;
		}


};

export default reducer;