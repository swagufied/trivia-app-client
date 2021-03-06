import React, { Component } from 'react';
// import {getDesiredType} from '../../utils/socketUtils'
import { connect } from 'react-redux';
import initAuthFactory, {refreshAuth} from '../../redux/auth'
import {isMapsEqual} from '../../utils/comparisonUtils'


import Question from './gameComponents/Question';
import Answer from './gameComponents/Answer';
import Scoreboard from './gameComponents/Scoreboard'


class Game extends Component {

	constructor(props){
		super(props)


		this.state = {
			players:[],
			gameState: 'WAITING',
			isHost: false,
			timer: null,
			question: null,
			answer: null
		}


		this.startGame = this.startGame.bind(this);
	}

	componentDidMount(){

		if (this.props.socket.type == 'UPDATE_GAME'){
			this.updateRoom(this.props.socket.message);
		}

	}

	componentDidUpdate(prevProps){
		// console.log(this.props)
		if ( this.props.socket.type == 'UPDATE_GAME' && (prevProps.socket.message_number != this.props.socket.message_number  )){
			this.updateRoom(this.props.socket.message);
		}

	}


    updateRoom(message){
    	// console.log('UPDATING_ROOM', message)
    	var updateMap = {};

    	if (message.type == "UPDATE_PLAYERS"){

    		// figure out if user is the host
    		let current_user_index = 0 // track index of the current player
    		for (var i = 0; i < message.data.players.length; i++){
    			if (message.data.players[i].is_self){

    				if (message.data.players[i].is_host){
    					updateMap.isHost = true;
    				}

    				current_user_index = i
    				break
    			}

    		}
    		// move the current player to the top of the player list.
    		const movedPlayer = message.data.players[0]
    		message.data.players[0] = message.data.players[current_user_index]
    		message.data.players[current_user_index] = movedPlayer

    		updateMap.players = message.data.players;
    	} else if (message.type == "UPDATE_TIMER") {
    		updateMap.timer = message.data.timer
    	} else if (message.type == "START_GAME"){
    		updateMap.gameState = "STARTING";

    	} else if (message.type == "QUESTION_PHASE"){
    		updateMap.gameState = message.type;
    		updateMap.question = message.data.question
    		updateMap.timer = null
    	} else if (message.type == "ANSWER_PHASE"){
    		updateMap.gameState = message.type;
    		updateMap.answer = message.data	
    		updateMap.timer = null
    	} else if (message.type == "ENDING_GAME"){
    		updateMap.gameState = message.type;
    	}

		this.setState(updateMap);

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

		const {gameState, isHost, players, timer} = this.state
		const {socket, room_id} = this.props
		// waiting room
		if (gameState == "WAITING"){

			let gameStartButton;
			if (isHost){
				gameStartButton = <button onClick={this.startGame}>Game Start</button>
			} else {
				gameStartButton = null
			}

			return (
				<div>
					<Scoreboard players = {this.state.players} renderScores={false}/>
					{gameStartButton}
				</div>
				)

		}
		// game starting
		else if (gameState == "STARTING") {
			return (
				<div>
					<Scoreboard players = {this.state.players} renderScores={false}/>
					Game starting in: {timer}
				</div>
				)
		}
		// question phase
		else if (gameState == "QUESTION_PHASE"){
			return (
				<div>
					<Scoreboard players = {this.state.players} renderScores={false}/>
					Time Remaining: {timer}
					<Question question = {this.state.question} socket={socket} room_id = {room_id}/>
				</div>
				)
		}
		// answer phase
		else if (gameState == "ANSWER_PHASE"){
			return (
				<div>
					<Scoreboard players = {this.state.players} renderScores={false}/>
					Next question in: {timer}
					<Answer answer = {this.state.answer} />
				</div>
				)
		}
		// game over
		else if (gameState == "FINISHED"){
			return (
				<div>
					<Scoreboard players = {this.state.players} renderScores={false}/>
				</div>
				)
		}

		return "you are in the game"
		
	}
}

const mapStoreToProps = store => store;
const mapDispatchToProps = dispatch => ({});

export default connect(mapStoreToProps, mapDispatchToProps)(Game);

// export default Game;