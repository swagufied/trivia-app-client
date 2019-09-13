import React, {Component} from "react";
import axios from 'axios';
import {baseUrl, accessKey} from "../config";
import AuthToken from "../../utils/tokenManagement"

export default class Register extends Component {

	constructor(props){
		super(props)

		// console.log(this.props)
		this.state = {
			username:"",
			errors:"",
			// password:""
		}
		this.register = this.register.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}


 	handleChange(event) {
 		const key = event.target.name
	    this.setState({[key]: event.target.value});
	  }

	

	register(event){

		const url = baseUrl + 'register';
		const data = {username:this.state.username};
		axios.post(url, data).then(response => {

			if (response.data.errors){
				this.setState({errors: response.data.errors});
			} else {
				AuthToken.set(accessKey, response.data.access_token)
				this.props.history.push('/login')
			}
			
		});
		event.preventDefault();
	}

	render(){
		const {errors} = this.state;

		
			return (
				<div>
					<h1>Register</h1>
					<p>{errors}</p>
					<form onSubmit={this.register}>
						username: <input type="text" name="username" onChange={this.handleChange} />
						<button type="submit">register</button>
					</form>
					<a href="/login">already have an account?</a>
				</div>
			);
		
		
		 
	}
}