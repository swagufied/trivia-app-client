import React, { Component } from 'react';


class Question extends Component {

	constructor(props){
		super(props)

		this.state = {
			answer_input: "",
			last_answer: ""
		}
		this.handleChange = this.handleChange.bind(this);
		this.submitAnswer = this.submitAnswer.bind(this);
	}

	handleChange(event) {
 		const key = event.target.name
	    this.setState({[key]: event.target.value});
	}

	componentDidUpdate(prevProps){ 
		// console.log(this.props)
		if ( this.props.socket.type == 'UPDATE_GAME' && (prevProps.socket.message_number != this.props.socket.message_number  )){
			this.handleSocketUpdate(this.props.socket.message);
		}

	}

	handleSocketUpdate(message){

		if (message.type == "ANSWER_SUBMIT") {
			this.state.answer_input = message.data.answer
		}
	}

	submitAnswer(event){
		event.preventDefault()
		this.props.socket.instance.send(

			JSON.stringify({
				'type': 'UPDATE_GAME',
				'room_id': this.props.room_id,
				'data': {
					
					'type': 'ANSWER_SUBMIT',
					'data': this.state.answer_input
				}
			})
		);
	}

	render(){
		const {question} = this.props
		const {last_answer} = this.state
		return (
			<div>
				<p><b>{question.text}</b></p>
				<p>{last_answer}</p>
				<form onSubmit={this.submitAnswer}>
					<input type="text" name="answer_input" onChange={this.handleChange} />
					<button type="submit">submit</button>
				</form>
			</div>
		);

	}
}


export default Question;
