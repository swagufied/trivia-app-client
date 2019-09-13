import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

// import {getDesiredType} from '../../utils/socketUtils'

class Navbar extends Component {

	render(){

		let username = ""
		if (this.props.auth.user) {
			username = this.props.auth.user.username;
		}
		return (
			<div>
				current user: {username}
				<hr/>
			</div>
			)
	}
}



const mapPropsToProps = store => store;
const mapDispatchToProps = dispatch => ({
});

export default connect(mapPropsToProps, mapDispatchToProps)(Navbar);
