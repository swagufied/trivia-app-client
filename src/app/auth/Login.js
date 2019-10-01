import React, {Component} from "react";
import {requestTokenWithCredentials} from 'utils/auth/credentialAuthentication'

import {Redirect, Route} from 'react-router';


const errorStyle = {
  color: "red"
};

class Login extends Component {

	constructor(props){
		super(props)

		console.log('login', this.props)
		this.state = {
			username:"",
			password:'party123',
			error:"",
			redirect: false
		}
		this.login = this.login.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}


 	handleChange(event) {
 		const key = event.target.name
	    this.setState({[key]: event.target.value});
	  }

	login(event){
		console.log('LOGGING IN')


		
		requestTokenWithCredentials(this.state.username, this.state.password)
		.then(response => {
			this.setState({redirect: true});
		}).catch(error => {
			this.setState({error: error});
		});

		event.preventDefault();
	}

	render(){
		const {error, redirect} = this.state;
		let { from } = this.props.location.state || { from: { pathname: "/" } };


    	if (redirect) return <Redirect to={from.pathname} />;

		return (
			<div>
				<h1>LOGIN</h1>
				<p style={errorStyle}>{error}</p>
				<form onSubmit={this.login}>
					username: <input type="text" name="username" onChange={this.handleChange} />
					<button type="submit">login</button>
				</form>
				<a href="/register">Don't have an account?</a>
			</div>
		);
		
		
		 
	}
}
export default Login
// const mapStoreToProps = store => store;
// const mapDispatchToProps = dispatch => ({
//     dispatch: dispatch
// });

// export default connect(mapStoreToProps, mapDispatchToProps)(Login);