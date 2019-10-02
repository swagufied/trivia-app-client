import React, { Component } from 'react';
// import {getDesiredType} from '../../utils/socketUtils'
import { connect } from 'react-redux';
import initAuthFactory, {refreshAuth} from '../../redux/auth'
import {isMapsEqual} from '../../utils/comparisonUtils'


import HUD from './HUD';
import Question from './Question';
import Answer from './Answer';

class Game extends Component {

	constructor(props){
		super(props)


		this.state = {
			players:[],
			gameState: 'WAITING',
			isHost: false
		}


		this.startGame = this.startGame.bind(this);
	}

	componentDidMount(){

		if (this.props.socket.type == 'UPDATE_GAME'){
			this.updateRoom(this.props.socket.message);
		}

	}

	componentDidUpdate(prevProps){
		console.log(this.props)
		if ( this.props.socket.type == 'UPDATE_GAME' && (prevProps.socket.type != 'UPDATE_GAME' || !isMapsEqual(this.props.socket.message, prevProps.socket.message) )){
			this.updateRoom(this.props.socket.message);
		}

	}


    updateRoom(message){
    	console.log('UPDATING_ROOM', message)
    	var updateMap = {};

    	if (message.type == "UPDATE_PLAYERS"){

    		// figure out if user is the host
    		for (var i = 0; i < message.data.players.length; i++){
    			if (this.props.auth.user.username == message.data.players[i].username && message.data.players[i].is_host){
    				updateMap.isHost = true;
    			}
    		}

    		updateMap.players = message.data.players;
    	} else if (message.type == "STARTING_GAME"){

    		updateMap.gameState = message.type;

    	} else if (message.type == "QUESTION_PHASE"){
    		updateMap.gameState = message.type;
    	} else if (message.type == "ANSWER_PHASE"){
    		updateMap.gameState = message.type;
    	} else if (message.type == "ENDING_GAME"){
    		updateMap.gameState = message.type;
    	}

		this.setState(updateMap);

    }

    



	renderPlayer(player, key){

		var string = player.username

		if (player.is_host) {
			string = string + " (host)"
		}

		if (player.is_self){
			return (
				<li key={key}><b>{string}</b></li>
			)
		}
		return (
			<li key={key}>{string}</li>
			)

	}

	startGame(){
		this.props.socket.instance.send(

			JSON.stringify({
				'type': 'UPDATE_GAME',
				'room_id': this.props.room_id,
				'data': {
					
					'type': 'START_GAME',
					'data': null
				}
			})
		);
	}

	render(){
		console.log(this.state)
		const { gameState, players, isHost } = this.state;
		var player_list = players.map((item, key) => this.renderPlayer(item, key), this)

		let gameStartButton;
		if (isHost){
			gameStartButton = <button onClick={this.startGame}>Game Start</button>
		} else {
			gameStartButton = null
		}


		if (['WAITING'].includes(gameState)) {

			return (
				<div>
					Players
					<ul>{player_list}</ul>

					{gameStartButton}
				</div>
			)
		} else if (['STARTING_GAME'].includes(gameState)) {

			return (
				<div>
					Players
					<ul>{player_list}</ul>

					Game will be starting shortly.
				</div>
			)
		} else {

			return (
				<div>
					<HUD />
					<Question />
					<Answer />
				</div>

			)
			

		}

		
	}
}

const mapStoreToProps = store => store;
const mapDispatchToProps = dispatch => ({
	// initAuth: initAuthFactory(dispatch),
});

export default connect(mapStoreToProps, mapDispatchToProps)(Game);

// export default Game;