import ReconnectingWebsocket from './ReconnectingWebsocket'
import {onOpen, onMessage} from './socketFunctions'
import {socketBaseURL} from 'config'

export default function initSocket() {

	let socket = new ReconnectingWebsocket()
	console.log(onOpen)
	socket.onopen = onOpen
	socket.onmessage = onMessage
	socket.open(socketBaseURL)
	console.log(socket)
	return socket

}

