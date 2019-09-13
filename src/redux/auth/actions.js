import { createAction } from 'redux-actions';

export const actionsTypes = {
	AUTHENTICATING_USER: 'AUTHENTICATING_USER',
	AUTHENTICATED_USER: 'AUTHENTICATED_USER',
	AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
	'REFRESH_STATE': 'REFRESH_STATE',
	'SET_USER': 'SET_USER'
};

export default {
	authenticatedUser: createAction(actionsTypes.AUTHENTICATED_USER),
	authenticatingUser: createAction(actionsTypes.AUTHENTICATING_USER),
	error: createAction(actionsTypes.AUTHENTICATION_ERROR),
	refresh: createAction(actionsTypes.REFRESH_STATE),
	setUser: createAction(actionsTypes.SET_USER)
}