import ReconnectingWebsocket from './ReconnectingWebsocket'
import {onOpen, onMessage} from './socketFunctions'

// initialize socket
export default function initSocket(url) {

	let socket = new ReconnectingWebsocket()

	socket.onopen = onOpen
	socket.onmessage = onMessage
	socket.open(url)

	return socket

}

