import {customAxios as axios} from 'utils/axios'


// requests a ticket from the server and gets it validated
function onOpen(){
    // register the connection with the server
    axios.get('trivia/socket-ticket')
    .then(response => {
        if (response.data && response.data.ticket){
            this.send(JSON.stringify({
                'type': 'VALIDATE_CONNECTION',
                'data': {
                    'ticket': response.data.ticket
                }
            }));
        } else {
            this.error = 'There was an error authenticating the socket connection.'
        }

    }).catch(error => {
        this.error = error
    });
                

}

// handles messages received form socket
function onMessage(evt){


    // if the ticket was validated
    const payload = JSON.parse(evt.data);

    if (payload.type == "VALIDATE_CONNECTION"){
        if (!payload.data.is_successful){
            this.close()
        }
    } else {
        console.log('socket payload', payload)
        this.type = payload.type
       this.message = payload.data
    }

}

export {
    onOpen,
    onMessage
}