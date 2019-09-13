export default class Trivia extends Component {

	constructor(props){
		super(props)


		this.state = {
			answerSubmitted:false,
			players:[],
			answer:""
		}

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}


	componentWillReceiveProps(nextProps){
		this.socket = nextProps.socket

		if (this.socket.instance){
			console.log('chatr socket instance', this.socket)
			// this.socket.instance.on('message', function(data){
			// 	console.log('msg received', data)
			// })
		}

		if (this.socket.message){
			this.setState({log:[... this.state.log, this.socket.message]})
		}
    }

	handleChange(event) {
    	this.setState({input: event.target.value});
  	}

	handleSubmit(event) {
		event.preventDefault();
		if (this.socket.instance){
			this.socket.instance.send(JSON.stringify({'type':'chat_message', 'data':{'message':this.state.input}}))
			this.setState({input:""})
		} else {
			alert("Your socket is disconnected. Try reconnecting or refreshing.")
		}
			    
	}

	renderMessage(message){

		if (!message.sender){
			return (
				<li>{message.message}</li>
				)
		} else {
			return (
				<li>{message.sender}: {message.message}</li>
				)
		}
	}

	render(){

		const { input, log } = this.state;

		

		var chat_log = log.map((item, key) => this.renderMessage(item), this)



		return (
			<div>
				<ul>{chat_log}</ul>
				<form onSubmit={this.handleSubmit}>
					<input type="text" value={this.state.input} onChange={this.handleChange} />
					<input type="submit" value="send" />
				</form>
			</div>
			)
	}
}