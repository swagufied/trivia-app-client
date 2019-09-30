

// this will be used to manage each unique use of socket (i.e. each room)
class RoomSocket {

	constructor(socketStore, roomID) {
		this.socket = socketStore
		this.roomID = roomID
	}

	send(type, payload) {
		const ticket = this.socket.ticket;
		const roomID = this.roomID;

		this.socket.instance.send(JSON.stringify({
			'type': type,
			'ticket': ticket,
			'room_id': roomID,
			'data': payload
		}))
	}

	hasNewMessage(prevSocketState){

		if (
			(this.socket.roomID == this.roomID) && 
			(prevSocketState.socket.type != this.socket.type ||  
				!isMapsEqual(prevSocketState.socket.message, this.socket.message)
			) 
		)return true;

		return false;
	}

	receiveMessage(){

		// check if message is the same
		return {
			type: this.socket.type,
			data: this.socket.message
		}
		
	}

	receiveNewMessage(prevSocketState) {
		if (this.hasNewMessage(prevSocketState))return this.receiveMessage();
		return null;
	}



}


const reconnect =() => {

	if (socket.reconnectAttempts >= 3) {
		// some kind of error
	} else {
		initSocket
	}

	// check number of reconnect attempts


}