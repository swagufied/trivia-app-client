import React, {Component} from "react";
import axios from 'axios';
import {baseUrl, accessKey, refreshKey} from "../config";
import AuthToken from '../../utils/tokenManagement'
import { connect } from 'react-redux';


class Login extends Component {

	constructor(props){
		super(props)

		// console.log(this.props)
		this.state = {
			username:"",
			errors:"",
			// password:""
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

		const this_ = this;

		axios.post(baseUrl + 'api/token/', {
			username:this.state.username, 
			password:'party123'
		}).then(response => {

				AuthToken.set(accessKey, response.data.access)
				AuthToken.set(refreshKey, response.data.refresh)
				this_.props.history.push('/trivia/room/1')
			
			
		}).catch(error => {

			if (error.response.status == 401){
				this_.setState({errors: 'incorrect username or password'});
			} else {
				this_.setState({errors: 'an unknown problem occurred'});
			}
			
		});
		event.preventDefault();
	}

	render(){
		const {errors} = this.state;

			return (
				<div>
					<h1>LOGIN</h1>
					<p>{errors}</p>
					<form onSubmit={this.login}>
						username: <input type="text" name="username" onChange={this.handleChange} />
						<button type="submit">login</button>
					</form>
					<a href="/register">don't have an account?</a>
				</div>
			);
		
		
		 
	}
}

const mapStoreToProps = store => store;
const mapDispatchToProps = dispatch => ({
    // setUser: setUser(dispatch)
});

export default connect(mapStoreToProps, mapDispatchToProps)(Login);