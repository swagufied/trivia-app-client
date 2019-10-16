import {customAxios as axios} from 'utils/axios'

function onOpen(){
    console.log('socket opened')
    // register the connection with the server
    axios.get('trivia/socket-ticket')
    .then(response => {
        // console.log(response.data.ticket)
        if (response.data && response.data.ticket){
            this.send(JSON.stringify({
                'type': 'VALIDATE_CONNECTION',
                'data': {
                    'ticket': response.data.ticket
                }
            }));
        } else {
            console.log('error in validating socket connection', response);
            this.error = 'error in validating socket connection'
        }

    }).catch(error => {
        console.error('error', error);
        this.error = error
    });
                

}


function onMessage(evt){


    // if the ticket was validated
    const payload = JSON.parse(evt.data);

    if (payload.type == "VALIDATE_CONNECTION"){
        if (!payload.data.is_successful){
            this.close()
        }
    } else {

       this.message = payload
    }

}

export {
    onOpen,
    onMessage
}