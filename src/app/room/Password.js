import React, { Component } from 'react';

import {customAxios as axios} from 'utils/axios';
import {baseURL} from 'config';


// needs a callback for indicating password veriification, and the room id number
const overlayStyle = {
  position: "fixed", /* Sit on top of the page content */
  width: "100%", /* Full width (cover the whole page) */
  height: "100%", /* Full height (cover the whole page) */
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  "backgroundColor": "rgba(0,0,0,0.5)", /* Black background with opacity */
  "zIndex": 2, /* Specify a stack order in case you're using a different order for other elements */
  cursor: "pointer" /* Add a pointer on hover */

}

const overlayBoxStyle = {
	"backgroundColor": "#fefefe",
  margin: "15% auto", /* 15% from the top and centered */
  padding: "20px",
  border: "1px solid #888",
  width: "80%"
}

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

		axios.post(baseURL + 'trivia/verify-room-password' , {
			room_id: this_.props.room_id,
			password: this_.state.passwordInput
		}).then( response => {
			
			if (response.data && response.data.is_successful) {
				console.log("Room password was successfully verified");
				this_.props.updatePassword(this_.state.passwordInput);
				this_.props.verifyPassword();
			} else {
				this_.setState({
					errorMessage: response.data.error
				});
			}
		}).catch( error => {
			this_.setState({errorMessage: "Something went wrong trying to verify the password."})
		})
	}

	render(){
		
		return (

			<div style={overlayStyle}>
				<div style={overlayBoxStyle}>
					<h1>Input Password</h1>
					{this.state.errorMessage}
					<form onSubmit={this.handleSubmit}>
						<input type="text" value={this.state.passwordInput} onChange={this.handleChange} />
						<input type="submit" value="send" />
					</form>
				</div>
			</div>

		);

	}
}



// const mapStoreToProps = store => store;
// const mapDispatchToProps = dispatch => ({
// });

// export default connect(mapStoreToProps, mapDispatchToProps)(Password);