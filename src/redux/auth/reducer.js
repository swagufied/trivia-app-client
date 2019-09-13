import { actionsTypes } from './actions';

const initialState = {

	attemptingVerification: false,
	attemptedVerification: false,
	isAuthenticated: false,
	error: null,
	refresh: false,
	user: null
}

const reducer = (state = initialState, { type, payload }) => {

	switch(type) {

		case actionsTypes.AUTHENTICATING_USER:

			return {
					...state,
					attemptingVerification: true,
					isAuthenticated: false,
					refresh: false
				};
			
		case actionsTypes.AUTHENTICATED_USER:

			return {
					...state,
					attemptingVerification: false,
					attemptedVerification: true,
					isAuthenticated: true,
					refresh: false
				};

		case actionsTypes.AUTHENTICATION_ERROR:

			return {
					...state,
					attemptingVerification: false,
					attemptedVerification: true,
					isAuthenticated: false,
					error: payload,
					refresh: false
				};
		case actionsTypes.REFRESH_STATE:
			return {

				attemptedVerification: false,
				isAuthenticated: false,
				error: null,
				refresh: true,
				user: null
			};
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