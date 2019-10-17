import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

// import {getDesiredType} from '../../utils/socketUtils'

class Chat extends Component {

	constructor(props){
		super(props)

		this.state = {
			input:"",
			log:[]
		}

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	componentDidUpdate(prevProps){


		if (this.props.socket.type == 'UPDATE_CHAT' && this.props.socket.message_number != prevProps.socket.message_number){
			this.setState(
				{
					log:[... this.state.log, this.props.socket.message]
				}
			);
		}

    }

	handleChange(event) {
    	this.setState({input: event.target.value});
  	}

	handleSubmit(event) {
		event.preventDefault();
		if (this.props.socket.instance){
			this.props.socket.instance.send(
				JSON.stringify({
					'type':'UPDATE_CHAT', 
					'room_id': this.props.room_id,
					'data':{
						'message':this.state.input 
						
					}
				})
				);
			this.setState({input:""})
		} else {
			alert("Your socket is disconnected. Try reconnecting or refreshing.")
		}
			    
	}

	renderMessage(message, index){
		// console.log('message', message)
		if (!message.username){
			return (
				<li key={index}>{message.message}</li>
				)
		} else {
			return (
				<li key={index}>{message.username}: {message.message}</li>
				)
		}
	}


	render(){

		const { input, log } = this.state;

		// const chat_log = this.updateChatLog(log, this.props.socket.message)

		var chat_log = log.map((item, key) => this.renderMessage(item, key), this)



		return (
			<div>
				Chat
				<ul>{chat_log}</ul>
				<form onSubmit={this.handleSubmit}>
					<input type="text" value={this.state.input} onChange={this.handleChange} />
					<input type="submit" value="send" />
				</form>
			</div>
			)
	}
}

Chat.propTypes = {
    socket: PropTypes.object.isRequired,
    room_id: PropTypes.string.isRequired
    // initSocket: PropTypes.func.isRequired,
};

const mapPropsToProps = store => store;
const mapDispatchToProps = dispatch => ({
});

export default connect(mapPropsToProps, mapDispatchToProps)(Chat);
