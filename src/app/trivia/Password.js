import React, { Component } from 'react';

import axios from 'axios';
import {baseUrl} from '../config';
import AuthToken from '../../utils/tokenManagement';


// needs a callback for indicating password veriification, and the room id number

export default class Password extends Component {

	constructor(props){
		super(props);


		this.state = {

			'passwordInput': "",
			"errorMessage": ""


		}

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}


	
	handleChange(event) {
    	this.setState({passwordInput: event.target.value});
  	}

	handleSubmit(event) {
		event.preventDefault();
		const this_ = this;

		axios.post(baseUrl + 'trivia/verify-room-password' , {
			room_id: this_.props.room_id,
			password: this_.state.passwordInput
		}, {
			headers: {
				Authorization: 'Bearer ' + AuthToken.get(AuthToken.accessTokenKey)
			}
		}).then( response => {
			console.log(response);
			if (response.data && response.data.is_successful) {
				this_.props.verifyPassword();
			} else {
				this_.setState({
					errorMessage: response.data.error
				});
			}
		}).catch( error => {
			console.log('room password error', error);
		})
	}

	render(){
		
		return (

			<div>
				<h1>Input Password</h1>
				{this.state.errorMessage}
				<form onSubmit={this.handleSubmit}>
					<input type="text" value={this.state.passwordInput} onChange={this.handleChange} />
					<input type="submit" value="send" />
				</form>
			</div>

		);

	}
}



// const mapStoreToProps = store => store;
// const mapDispatchToProps = dispatch => ({
// });

// export default connect(mapStoreToProps, mapDispatchToProps)(Password);