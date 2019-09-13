import React, { Component } from 'react';
import {Redirect, Route} from 'react-router';
import {socketBaseURL} from '../socket/socketConfig'
import {accessKey, refreshKey} from './config'

import CircularProgress from '@material-ui/core/CircularProgress';
import SocketIndicator from '../socket/Indicator';
import SocketCommand from '../socket/Command';

import initSocketFactory from '../redux/socket/initSocket';
import { connect } from 'react-redux';


const loaderStyle = {
    position: 'relative',
    top: 0,
    left: 'calc(50% - 45px)',
};


const generateRoomURL = () => {

}

class SocketRoute extends Component {

	constructor(props){
		super(props)
		this.state = {
			socketVerified: false
		}

		console.log('SocketRoute props', props)

		this.reconnect = this.reconnect.bind(this);
	}

	componentDidMount() {
        this.reconnect();
    }

    componentWillReceiveProps(){
    	console.log('Socket Route componentWillReceiveProps', this.props, this.state)
    	this.reconnect();
    }

    reconnect(){
    	this.props.initSocket(socketBaseURL + 'trivia/room/' + this.props.computedMatch.params.id + '/');
    	const socketVerified = this.state.socketVerified;
    	const socketInstance = this.props.socket.instance;
    	const getToken = this.props.getToken;
    	console.log(socketInstance)
        if (!socketVerified){
        	if (socketInstance){
	            socketInstance.send(JSON.stringify( 
	            	{
	            		'type': 'join_room', 
	            		'data':{
	            			'access_token': getToken(accessKey)
	            		}
	            	}
	            	))
	            this.setState({socketVerified:true})
	            console.log(this.state.socketVerified)
	        }
        }
    }

	render(){
		const {state, socket, reconnect, props} = this;
		const socketVerified = this.state.socketVerified;

		if (socketVerified){
			return(
				<div>
					<SocketIndicator socket={socket} reconnect={reconnect}/>
					<SocketCommand socket={socket} reconnect={reconnect} />
					<Route {...props} />
				</div>
				) 
		} else {
			return (<div className="loading-wrapper">
                        <CircularProgress size={70} status="loading" style={loaderStyle} />
                    </div>
                   )
		}
	}
	
}

const mapPropsToProps = store => store;
const mapDispatchToProps = dispatch => ({
    initSocket: initSocketFactory(dispatch),
});

export default connect(mapPropsToProps, mapDispatchToProps)(SocketRoute);