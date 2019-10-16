// const WebSocket = requi  re('ws');


export default function WebSocketClient(){
    this.number = 0;    // Message number
    this.autoReconnectInterval = 5*1000;    // ms
    this.message = ""
    this.connected = false
    this.connecting = false
}
WebSocketClient.prototype.open = function(url){
    console.log('websocket open', url)
    this.connecting=true
    this.url = url;
    this.instance = new WebSocket(this.url);
    
    this.instance.onopen =  () => {
        this.connecting=false
        this.connected=true
        this.onopen()
        this.forceComponentUpdate()
    }

    this.instance.onmessage = (data,flags)=>{
        this.number++;
        this.onmessage(data,flags,this.number);
        this.forceComponentUpdate()
    };

    this.instance.onclose = (e)=>{
        switch (e.code){
        case 1000:  // CLOSE_NORMAL
            console.log("WebSocket: closed");
            break;
        default:    // Abnormal closure
            this.reconnect(e);
            break;
        }
        this.onclose(e);
        this.forceComponentUpdate()
    };
    this.instance.onerror = (e)=>{
        switch (e.code){
        case 'ECONNREFUSED':
            this.reconnect(e);
            break;
        default:
            this.onerror(e);
            break;
        }
        this.forceComponentUpdate()
    };
}
WebSocketClient.prototype.send = function(data,option){
    try{
        this.instance.send(data,option);
    }catch (e){
        this.instance.emit('error',e);
    }
}
WebSocketClient.prototype.reconnect = function(e){
    console.log(`WebSocketClient: retry in ${this.autoReconnectInterval}ms`,e);
        this.instance.removeAllListeners();
    var that = this;
    setTimeout(function(){
        console.log("WebSocketClient: reconnecting...");
        that.open(that.url);
    },this.autoReconnectInterval);
}
WebSocketClient.prototype.onopen =function(e){  console.log("WebSocketClient: open",arguments); }
WebSocketClient.prototype.onmessage = function(data,flags,number){  console.log("WebSocketClient: message",arguments);  }
WebSocketClient.prototype.onerror = function(e){    console.log("WebSocketClient: error",arguments);    }
WebSocketClient.prototype.onclose = function(e){    console.log("WebSocketClient: closed",arguments);   }
WebSocketClient.prototype.forceComponentUpdate = function(){}

// var wsc = new WebSocketClient();
// wsc.open('wss://localhost:443/');
// wsc.onopen = function(e){
//     console.log("WebSocketClient connected:",e);
//     this.send("Hello World !");
// }
// wsc.onmessage = function(data,flags,number){
//     console.log(`WebSocketClient message #${number}: `,data);
// }