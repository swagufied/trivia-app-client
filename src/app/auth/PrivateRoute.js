import React from 'react';
import {Redirect, Route} from 'react-router';


import SocketRoute from 'app/socket/SocketRoute'
import {updateAuthenticationStatus} from 'utils/auth/verificationFunctions'

// determine if user is logged in or not
const PrivateRoute = ({ authState: authState, isSocketRoute: isSocketRoute, component: Component, ...props}) => {

	// if user is authenticated
	if (authState.isAuthenticated) {
		// if the socket needs to connect as well
		if (isSocketRoute) return <SocketRoute {...props} component={Component} />;

		return <Component {...props} />

	// if the user is not authenticated
	} else if (authState.attemptedVerification && !authState.isAuthenticated){
		return <Redirect to={{pathname: '/login', state: { from: props.location }}} />;
		
	// if the user is currently being authenticated or has been authenticated (ie has token) and the token needs to be validated.
	} else if (authState.attemptingVerification) {
		return ""
	}

	updateAuthenticationStatus();
	return "" // TODO - is this a hack solution? to prevent redirecting since AuthToken.verify is async
	

}

export default PrivateRoute;
