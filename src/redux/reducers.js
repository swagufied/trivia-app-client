import { combineReducers } from 'redux';

import socket from './socket/reducer';
import auth from './auth/reducer';
// import game from '../trivia/reducer';

export default combineReducers({
    socket,
    auth,
    // game,
});