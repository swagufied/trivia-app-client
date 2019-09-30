import React, { Component } from 'react';
import {Redirect, Route} from 'react-router';


import { connect } from 'react-redux';
import initAuthFactory, {refreshAuth} from '../../redux/auth'
import SocketRoute from '../socket/SocketRoute'
import AuthToken from '../../utils/tokenManagement'



const PrivateRoute = ({ authState: authState, isSocketRoute: isSocketRoute, ...props}) => {
	
	if (authState.isAuthenticated) {

		if (isSocketRoute) return <SocketRoute {...props} />;

		return <Route {...props} />
	} else if (authState.attemptedVerification && !authState.isAuthenticated){

		AuthToken.verify();
		return "" // TODO - is this a hack solution? to prevent redirecting since AuthToken.verify is async
	}

	return <Redirect to={{pathname: '/login', state: { from: props.location }}} />;

}

export default PrivateRoute;
