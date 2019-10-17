import React, { Component } from 'react';
import {Route} from 'react-router';
import initSocketFactory from 'redux/socket'
import { connect } from 'react-redux';


// initializes socket and updates children when socket receives message

class SocketRoute extends Component {
	constructor(props){
		super(props)
	}
	componentDidMount(){
		this.props.initSocket(this.props.socketURL);
	}

	
	render(){

		const { props } = this;
		const {socket} = this.props;
		const Component = props.component
		// console.log('socket', socket)
		if (socket && socket.connected && socket.instance){
			return <Component  {...this.props} socket={socket} />
			
		} else {
			return "Connecting socket...";
		}
	}
}

const mapStoreToProps = store => store;
const mapDispatchToProps = dispatch => ({
	initSocket: initSocketFactory(dispatch)
});

export default connect(mapStoreToProps, mapDispatchToProps)(SocketRoute);

// export default SocketRoute