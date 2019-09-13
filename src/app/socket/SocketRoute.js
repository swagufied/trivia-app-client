import React, { Component } from 'react';
import {Route} from 'react-router';

import axios from 'axios';
import { connect } from 'react-redux';
import {socketBaseURL} from './socketConfig';
import {baseUrl} from '../config'
import AuthToken from '../../utils/tokenManagement'
import initSocketFactory from '../../redux/socket'

const maxConnectAttempts = 3;
class SocketRoute extends Component {

	constructor(props){
		super(props);


		console.log(Date.now())

		this.state = {

			'connectingSocket': false,
			'isValidated': false,
			'isValidating': false,
			'didValidationFail': false,
			lastAttemptedConnect: 0,
			'numConnectAttempts': 0,


		}
	}

	componentDidMount(){
		this.props.initSocket(socketBaseURL);
		this.reconnect();
	}

	componentDidUpdate(){
		this.reconnect();
	}

	reconnect(){
		
		if (!this.props.socket.instance && ! this.props.socket.loading){

			// console.log('ATTEPTING TO CONNECT SOCKET');
			// console.log(Date.now() - this.state.lastAttemptedConnect)

			


			// if (Date.now() - this.state.lastAttemptedConnect > 1000 && this.state.numConnectAttempts <= maxConnectAttempts){
				
			// 	this.setState({
			// 		lastAttemptedConnect: Date.now(),
			// 		numConnectAttempts: this.state.numConnectAttempts + 1
			// 	}, () => {
			// 		this.props.initSocket(socketBaseURL);
			// 		setTimeout( () => {
			// 			console.log('TIM UP')
			// 			this.reconnect();
			// 		}, 1000)
			// 	});
			// } else {

			// }
		}

		if (this.props.socket.instance) {


			if (!this.state.isValidated && !this.state.isValidating){

			

				console.log('VALIDATING SOCKET CONNECTION')
				this.setState({
					isValidating: true
				}, () => {
					axios.get(baseUrl + 'trivia/socket-ticket', {
						headers: {
							Authorization: 'Bearer ' + AuthToken.get(AuthToken.accessTokenKey)
						}
					}).then(response => {
						// console.log(response.data.ticket)
						if (response.data && response.data.ticket){
							this.props.socket.instance.send(JSON.stringify({
								'type': 'VALIDATE_CONNECTION',
								'data': {
									'ticket': response.data.ticket
								}
							}));
						} else {
							console.log('error in validating socket connection', response);
						}

					}).catch(error => {
						console.log('error', error);
					});
				});
				

				
			} else if (!this.state.isValidated && this.props.socket.type == "VALIDATE_CONNECTION" && this.props.socket.message.is_successful) {
				console.log('SOCKET CONFIRMED CONNECTED')
				this.setState({
					'didValidationFail': false,
					'isValidating': false,
					'isValidated': true
				})
			}

		}


		

	}


	render(){

		const { socket } = this.props;
		// console.log(auth)
		if (socket.connected && socket.instance && this.state.isValidated){

			return <Route  {...this.props} />
			
		} else if ( this.state.numConnectAttempts >= maxConnectAttempts ){
			return "Failed to connect to socket...";
		} else {
			return "Connecting socket...";
		}
	}
}


const mapStoreToProps = store => store;
const mapDispatchToProps = dispatch => ({
    initSocket: initSocketFactory(dispatch),
});

export default connect(mapStoreToProps, mapDispatchToProps)(SocketRoute);