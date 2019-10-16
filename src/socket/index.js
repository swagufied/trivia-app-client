import ReconnectingWebsocket from './ReconnectingWebsocket'
import {onOpen, onMessage} from './socketFunctions'
import {socketBaseURL} from 'config'

// initialize socket
export default function initSocket() {

	let socket = new ReconnectingWebsocket()

	socket.onopen = onOpen
	socket.onmessage = onMessage
	socket.open(socketBaseURL)

	return socket

}

