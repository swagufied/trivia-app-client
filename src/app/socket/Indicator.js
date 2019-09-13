import React from 'react';
import PropTypes from 'prop-types';
import { CardActions } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Switch from '@material-ui/core/Switch';

const isString = input => typeof input === 'string';

const Indicator = ({ socket }) => {
    const gray = 'rgb(189, 189, 189)';
    const switchColor = () => {
        if (socket.error) return 'red';
        if (socket.loading) return 'orange';
        if (socket.connected) return 'green';

        return 'rgb(245, 245, 245)';
    };

    const label = () => {
        if (socket.connected) return 'Socket connected';
        if (socket.loading) return 'Socket connecting...';
        if (socket.error && isString(socket.error)) return `An error occured (${socket.error})`;
        if (socket.error) return 'An error occured';

        return 'Socket disconnected';
    };

    const toggleSocket = () => {
        console.log('toggling socket: current state - '+socket.connected);
        socket.connected = !socket.connected;
        console.log('toggled socket: changed state - '+socket.connected);
    }
    console.log('indicater socket',socket)


    return (
        <div>
            {label()}
            <Switch
                onChange={toggleSocket}
               
            />

        </div>
    );
};

Indicator.propTypes = {
    socket: PropTypes.object.isRequired,
};

export default Indicator;