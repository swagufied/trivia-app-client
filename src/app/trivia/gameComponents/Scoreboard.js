import React from 'react';



/*

renders the scoreboard for the trivia game

players = [{
	username
	score,
	is_host,
	is_self
}]

*/
const Scoreboard = ({players:players, renderScores: renderScores}) => {

	let player_rows = players.map((item, key) => renderPlayerRow(item, key, renderScores))

	return <table><tbody>{player_rows}</tbody></table>;

}

function renderPlayerRow(player, key, renderScores){

	const username = player.is_host ? player.username + " (host)" : player.username;

	return (
		<tr key={key}>
			<td>{player.is_self ? <b>{username}</b> : username}</td>
			<td>{renderScores ? player.score : null}</td>
		</tr>
	)


}

export default Scoreboard