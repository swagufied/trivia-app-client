import React, { Component } from 'react';
import {Route} from 'react-router';
import Socket from 'socket'

// initializes socket and updates children when socket receives message

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

		const { socket, props } = this;
		const Component = props.component

		if (socket && socket.connected && socket.instance){
			
			return <Component  {...this.props} />
			
		} else {
			return "Connecting socket...";
		}
	}
}

export default SocketRoute