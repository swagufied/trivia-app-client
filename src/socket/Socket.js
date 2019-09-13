export default class Socket {

    constructor(){


        
        this.initialState = {
            instance: null,
            loading: false,
            connected: false,
            error: null,
            message: null
        }
        this.state = {};

        this.onMessageCallback = null;
        this.onOpenCallback = null;

        // this.connect(uri);
        
    }

    connect(uri) {

        if (!('WebSocket' in window)) {
            this_.state = {
                ...this_.state,
                error: 'WebSocket is not supported by your browser',
                loading: false
            }
            return;
        }

        const socket = new WebSocket(uri);
        this.state = this.initialState
        const this_ = this;

        socket.onopen = () => {
            this_.state = {
                ...this_.state,
                connected: true,
                loading: false,
                instance: socket
            }

            if(this_.onOpenCallback && typeof this_.onOpenCallback === "function") {
                this_.onOpenCallback();
            }

        }

        socket.onerror = (err) => {
            this_.state = {
                ...this_.state,
                error: err,
                loading: false
            }
        }

        socket.onmessage = (evt) => {
            const evtJSON = JSON.parse(evt.data);
            console.log('Socket onmessage', evtJSON)

            this_.state = {
                ...this_.state,
                message: evtJSON.data,
                type: evtJSON.type
            }

            if(this_.onMessageCallback && typeof this_.onMessageCallback === "function") {
                this_.onMessageCallback(evtJSON);
            } 
        }

        console.log('onmessage init')

        socket.onclose = () => {
            this_.state = {
                ...this_.state,
                connected:false,
                loading: false,
                instance: null
            }
        }
    }

    // the callback must be able to handle json
    setOnMessageCallback(callback) {
        this.onMessageCallback = callback;
    }

    setOnOpenCallback(callback){
        this.onOpenCallback = callback;
    }

    send(type, data) {
     
        this.state.instance.send(JSON.stringify({
            type:type,
            data:data
        })) 
    }
}