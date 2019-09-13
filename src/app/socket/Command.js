import React from 'react';
import PropTypes from 'prop-types';
import { CardActions } from '@material-ui/core';
import Button from '@material-ui/core/Button';

const close = socket => () => {
    socket.instance.close();
};


const SocketCommand = ({ socket, reconnect }) => (
    <CardActions>
        <Button variant="contained" disabled={socket.connected} onClick={reconnect}>Connect</Button>
        <Button variant="contained"  disabled={!socket.connected} onClick={close(socket)}>Disconnect</Button>
    </CardActions>
);

SocketCommand.propTypes = {
    game: PropTypes.object.isRequired,
    socket: PropTypes.object.isRequired,
    reconnect: PropTypes.func.isRequired,
};

export default SocketCommand;