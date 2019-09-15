import { createStore } from 'redux';
import rootReducers from './reducers';

const configureStore = (rootReducer, initialState) => {
    const devTools = window.devToolsExtension ? window.devToolsExtension() : f => f;

    return createStore(rootReducer, initialState, devTools);
};

// export default configureStore;

const store = configureStore(rootReducers)

export {
	store
}