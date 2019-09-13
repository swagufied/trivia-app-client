import actions from './actions';

export default dispatch => (uri) => {
    if (!('WebSocket' in window)) {
        dispatch(actions.error({ error: 'WebSocket is not supported by your browser' }));
        return;
    }


    const socket = new WebSocket(uri);
    dispatch(actions.connect());

    console.log('socket connected')

    socket.onopen = () => dispatch(actions.open({ instance: socket }));
    socket.onerror = () => dispatch(actions.error({ error: true }));
    socket.onmessage = evt => dispatch(actions.message({ ...JSON.parse(evt.data) }));
    socket.onclose = () => dispatch(actions.close());
};
