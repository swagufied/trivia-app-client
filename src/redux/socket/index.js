import actions from './actions';
import Socket from 'socket'



// this intiates the socket connection. when socket is connected, it will be validated and stay connected if validation is successful
export default dispatch => (uri) => {
    if (!('WebSocket' in window)) {
        dispatch(actions.error({ error: 'WebSocket is not supported by your browser' }));
        return;
    }

    const socket = Socket(uri);

    socket.onOpenCallback = () => dispatch(actions.open({ instance: socket }));
    socket.onErrorCallback = () => dispatch(actions.error({ error: true }));
    socket.onMessageCallback = evt => dispatch(actions.message({ ...JSON.parse(evt.data) }));
    socket.onCloseCallback = () => dispatch(actions.close())
};

