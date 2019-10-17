import { actionsTypes } from './actions';

let message_number = 0
const initialState = {
    instance: null,
    loading: false,
    connected: false,
    error: null,
    message: null
};

const reducer = (state = initialState, { type, payload }) => {

    switch (type) {
    case actionsTypes.CONNECTING:
        return {
            ...state,
            loading: true,
        };
    case actionsTypes.OPENED:
        return {
            ...state,
            connected: true,
            loading: false,
            instance: payload.instance,
        };
    case actionsTypes.MESSAGED:
        // console.log('payload received', payload)

        message_number++
        return {
            ...state,
            message_number: message_number,
            message: payload.data,
            type: payload.type
        };
    case actionsTypes.ERROR:
        return {
            ...state,
            loading: false,
            error: payload.error,
        };
    case actionsTypes.CLOSED:
        return {
            ...state,
            loading: false,
            connected: false,
            instance: null,
        };
    default:
        return state;
    }
};

export default reducer;