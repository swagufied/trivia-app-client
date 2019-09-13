import React from 'react';
import ReactDOM from 'react-dom';

import * as serviceWorker from './serviceWorker';

// ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA


import Root from './app/Root';
import rootReducers from './redux/reducers';
import configureStore from './redux/configureStore';
import axios from 'axios';
// axios.defaults.withCredentials = true

const store = configureStore(rootReducers);

ReactDOM.render(
    <Root {...{ store }} />,
    document.getElementById('root')
);


serviceWorker.unregister();
