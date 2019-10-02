import React from 'react';
import {Redirect, Route} from 'react-router';


import SocketRoute from 'app/socket/SocketRoute'
import {verifyAuthenticationStatus} from 'utils/auth/credentialAuthentication'

// determine if user is logged in or not
const PrivateRoute = ({ authState: authState, isSocketRoute: isSocketRoute, ...props}) => {
	console.log(authState)
	if (authState.isAuthenticated) {

		if (isSocketRoute) return <SocketRoute {...props} />;

		return <Route {...props} />
	} else if (authState.attemptedVerification && !authState.isAuthenticated){
		return <Redirect to={{pathname: '/login', state: { from: props.location }}} />;
		
		
	} else if (authState.attemptingVerification) {
		return ""
	}

	verifyAuthenticationStatus();
	return "" // TODO - is this a hack solution? to prevent redirecting since AuthToken.verify is async
	

}

export default PrivateRoute;
