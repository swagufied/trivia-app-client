const getDesiredType = (type, message) => {
    var desired = null;

    // if message isnt an array
    // console.log('getDesiredType', message)
    if (!Array.isArray(message) || message==null){
        console.log('message is not an array', message)
        return
    }
    // console.log('confirmed array')
    for (var i = 0; i < message.length; i++){
        // console.log(message[i])
        for (var key in message[i]){
            
            if (message[i].hasOwnProperty(key)) {           
                if (message[i][key] === type){
                    desired = message[i];
                    return desired;
                }
            }

            if (desired){
                break;
            }
        }

    
    }
    return desired;
}

export {
    getDesiredType
}