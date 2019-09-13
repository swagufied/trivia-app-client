
import React, { Component } from 'react';

export default  class HUD extends Component {


	renderScore(user){

		return (
			<tr>
				<td>user.username</td>
				<td>user.score</td>
			</tr>
		)

	}

	render(){

		const scores = this.props.players.map((item, index) => this.renderScore(item), this );

		return (

			<div>

				<table>

					<tr>
						<td>player</td>
						<td>score</td>
					</tr>

					{scores}

				</table>

			</div>


		)

	}

}