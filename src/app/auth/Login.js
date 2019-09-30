import React, {Component} from "react";
import axios from 'axios';
import {baseUrl, accessKey, refreshKey} from "../config";
import AuthToken from 'utils/token_management'
import { connect } from 'react-redux';

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


		
		AuthToken.request(this.state.username, this.state.password, this.props.dispatch)
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


    	if (redirect) return <Redirect to={from} />;

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

const mapStoreToProps = store => store;
const mapDispatchToProps = dispatch => ({
    dispatch: dispatch
});

export default connect(mapStoreToProps, mapDispatchToProps)(Login);