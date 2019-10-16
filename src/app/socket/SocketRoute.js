import React, { Component } from 'react';
import {Route} from 'react-router';
import Socket from 'socket'


class SocketRoute extends Component {
	constructor(props){
		super(props)
		this.forceUpdate = this.forceUpdate.bind(this)
	}
	componentDidMount(){
		this.socket = Socket();
		this.socket.forceComponentUpdate = this.forceUpdate
	}

	forceUpdate(){
		this.setState({})
	}

	render(){
		const { socket } = this;
		console.log(socket)
		if (socket && socket.connected && socket.instance){

			return <Route  {...this.props} />
			
		} else {
			return "Connecting socket...";
		}
	}
}

export default SocketRoute