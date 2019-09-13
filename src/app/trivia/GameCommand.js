import React from 'react';
import PropTypes from 'prop-types';
import { CardActions } from '@material-ui/core';
import Button from '@material-ui/core/Button';



const gameStart = socket => () => {
    socket.instance.send('');
};

const GameCommand = ({ game, socket }) => (
    <CardActions>
        <Button variant="contained" onClick={gameStart(socket)}>Start Game</Button>
    </CardActions>
);

GameCommand.propTypes = {
    game: PropTypes.object.isRequired,
    socket: PropTypes.object.isRequired,
};

export default GameCommand;