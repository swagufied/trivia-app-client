import React, { Component } from 'react';
import {Redirect, Route} from 'react-router';


import { connect } from 'react-redux';
import initAuthFactory, {refreshAuth} from '../../redux/auth'
import SocketRoute from '../socket/SocketRoute'




const PrivateRoute = ({ authState: authState, isSocketRoute: isSocketRoute, ...props}) => {

	if (authState.isAuthenticated) {

		if (isSocketRoute) return <SocketRoute {...props} />;

		return <Route {...props} />
	} 

	return <Redirect to={{pathname: '/login', state: { from: props.location }}} />;

}

export default PrivateRoute;


// class AuthenticatedRoute extends Component {


// 	componentDidMount(){
// 		this.props.initAuth();
// 		// console.log(this.props)
// 	}



// 	render(){

// 		const { auth, isSocketRoute } = this.props;
// 		// console.log(auth)
// 		if (auth.attemptedVerification && auth.isAuthenticated){

// 			if (isSocketRoute){
// 				return <SocketRoute {...this.props} />
// 			}

// 			return <Route  {...this.props} />
			
// 		} else if ( (auth.attemptedVerification && auth.error) || auth.refresh) {
// 			return <Redirect to="/login" />
// 		} else {
// 			return "Verifying user...";
// 		}
// 	}
// }


// const mapStoreToProps = store => store;
// const mapDispatchToProps = dispatch => ({
//     initAuth: initAuthFactory(dispatch),
// });

// export default connect(mapStoreToProps, mapDispatchToProps)(AuthenticatedRoute);