import React, { Component } from 'react';
import {Redirect, Route} from 'react-router';


import SocketRoute from '../socket/SocketRoute'
import AuthToken from '../../utils/tokenManagement'
import {verifyAuthenticationStatus} from 'utils/auth/credentialAuthentication'


const PrivateRoute = ({ authState: authState, isSocketRoute: isSocketRoute, ...props}) => {

	if (authState.isAuthenticated) {

		if (isSocketRoute) return <SocketRoute {...props} />;

		return <Route {...props} />
	} else if (authState.attemptedVerification && !authState.isAuthenticated){
		return <Redirect to={{pathname: '/login', state: { from: props.location }}} />;
		
		
	}
	
	verifyAuthenticationStatus();
	return "" // TODO - is this a hack solution? to prevent redirecting since AuthToken.verify is async
	

}

export default PrivateRoute;
