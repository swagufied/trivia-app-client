import React, { Component } from 'react';


const Answer = ({answer:answer}) => {

	return (
		<div>
			<p><b>{answer.correct_answer}</b></p>
		</div>
		)
}
export default Answer