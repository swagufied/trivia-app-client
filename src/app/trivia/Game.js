import React, { Component } from 'react';
import Canvas from './Canvas';
import Chat from 'app/chat/Chat';


const Game = ({socket:socket, room_id: room_id, ...props}) => {
	return (
			<div>
				<Canvas socket={socket} room_id={room_id} />
				<Chat socket={socket} room_id={room_id} />
			</div>
			)	
}
export default Game