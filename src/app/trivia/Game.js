import React, { Component } from 'react';
import {getDesiredType} from '../../utils/socketUtils'
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
			isHost: true
		}


		this.startGame = this.startGame.bind(this);
	}

	componentDidMount(){

		if (this.props.socket.type == 'UPDATE_GAME'){
			this.updateRoom(this.props.socket.message);
		}

	}

	componentDidUpdate(prevProps){

		if ( this.props.socket.type == 'UPDATE_GAME' && (prevProps.socket.type != 'UPDATE_GAME' || !isMapsEqual(this.props.socket.message, prevProps.socket.message) )){
			this.updateRoom(this.props.socket.message);
		}

	}


    updateRoom(data){

    	var updateMap = {};

		if ( 'player_list' in this.props.socket.message ){
			updateMap.players = this.props.socket.message.player_list;
		}

		if ('is_host' in this.props.socket.message){
			updateMap.isHost = this.props.socket.message.is_host;
		}

		this.setState(updateMap);

    }

    



	renderPlayer(player, key){

		if (player.username == this.props.currentUser.username){
			return (
				<li key={key}><b>{player.username}</b></li>
			)
		}
		return (
			<li key={key}>{player.username}</li>
			)

	}

	startGame(){
		this.props.socket.instance.send(

			JSON.stringify({
				'type': 'UPDATE_GAME',
				'data': {
					'room_id': this.props.room_id,
					'type': 'GAME_START',
					'data': null
				}
			})
		);
	}

	render(){
		const { gameState, players, isHost } = this.state;
		var player_list = players.map((item, key) => this.renderPlayer(item, key), this)

		let gameStartButton;
		if (isHost){
			gameStartButton = <button onClick={this.startGame}>Game Start</button>
		} else {
			gameStartButton = null
		}


		if (gameState == 'WAITING') {

			return (
				<div>
					Players
					<ul>{player_list}</ul>

					{gameStartButton}
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

// const mapStoreToProps = store => store;
// const mapDispatchToProps = dispatch => ({
// 	// initAuth: initAuthFactory(dispatch),
// });

// export default connect(mapStoreToProps, mapDispatchToProps)(WaitingRoom);

export default Game;