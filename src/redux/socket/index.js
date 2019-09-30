import actions from './actions';
import WebSocketClient from '../../app/socket/ReconnectingWebsocket'
import axios from 'axios';
import {baseUrl} from '../../app/config'


/*CONFIG*/
const initialReconnectInterval = 1000;
const reconnectDecay = 2;
var currentReconnectInterval = initialReconnectInterval;
const maxReconnectAttempts = 3;

export default dispatch => (uri) => {
    if (!('WebSocket' in window)) {
        dispatch(actions.error({ error: 'WebSocket is not supported by your browser' }));
        return;
    }


    // const socket = initSocketConnection(uri, dispatch);

    // const socket = new WebSocket(uri);
    const socket = WebSocketClient;
    socket.open(uri)
    // dispatch(actions.connect());

    console.log('socket connected')

    // socket.onopen = () => dispatch(actions.open({ instance: socket }));
    socket.onopen = () => onOpen(socket, dispatch);

    socket.onerror = () => dispatch(actions.error({ error: true }));
    socket.onmessage = evt => dispatch(actions.message({ ...JSON.parse(evt.data) }));
    socket.onclose = () => onClose(socket, uri, dispatch)
};


function initSocketConnection(uri, dispatch){
    console.log('initSocketConnection')
    const socket = new WebSocket(uri);
    console.log('socket', socket)
    if (!socket) {
        setTimeout(initSocketConnection(uri, dispatch), currentReconnectInterval)
    }

    dispatch(actions.connect());
    // clearTimeout()


    return socket;
}


function onOpen(socket, dispatch){
    console.log('opopen', this)
    // set timer
    currentReconnectInterval = initialReconnectInterval;
    dispatch(actions.open({ instance: socket }));


    // register the connection with the server
    axios.get(baseUrl + 'trivia/socket-ticket')
    .then(response => {
        // console.log(response.data.ticket)
        if (response.data && response.data.ticket){
            socket.send(JSON.stringify({
                'type': 'VALIDATE_CONNECTION',
                'data': {
                    'ticket': response.data.ticket
                }
            }));
        } else {
            console.log('error in validating socket connection', response);
        }

    }).catch(error => {
        console.error('error', error);
    });
                

}


function onMessage(socket, dispatch, evt){


    // if the ticket was validated
    const payload = JSON.parse(evt.data);

    if (payload.type == "VALIDATE_CONNECTION"){
        if (!payload.data.is_successful){
            socket.close()
        }
    } else {

       dispatch(actions.message({ ...payload }));
    }

}

function onClose(socket, uri, dispatch) {
    // try and attempt reconnect
    console.log('socket closing')
    dispatch(actions.close());
    socket = null;
   setTimeout(initSocketConnection(uri, dispatch), currentReconnectInterval)
    currentReconnectInterval += reconnectDecay; // lengthen time before attempt is made

}

// const attemptReconnect = () => {

    
// }