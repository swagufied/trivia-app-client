import React, { Component } from 'react';
import PropTypes from 'prop-types';


import CircularProgress from '@material-ui/core/CircularProgress';
import {customAxios as axios} from 'utils/axios';
import {baseURL} from 'config'


import Password from './Password'


class Room extends Component {

    constructor(props){
        super(props)
        // console.log('Room props', props)
        this.state = {
            isAuthorized: false, // marker if user is allowed to join the room

            passwordRequired: true,
            passwordVerified: false,
            passwordInput: "",

            errorMessage: "You dont have permission to access this room.", // to display any error messages in connecting to the room

            attemptingJoin: false,
            attemptedJoin: false,
            didJoin: false, // if the user successfully joined the room
            numJoinAttempts: 0,

            name: "" // name of the room
        };

        this.verifyPassword = this.verifyPassword.bind(this);
        this.updatePassword = this.updatePassword.bind(this);

    }


    /*

    LIFECYCLE FUNCTIONS
    
    */
    componentDidMount() {
        // get the room info
        axios.get(baseURL + 'trivia/room/' + this.props.match.params.id)
        .then(response => {

            if (response.data){

                var update = {};

                // make sure the user is a member of the room if the room is in game
                if (!response.data.is_playing) {
                    update.isAuthorized = true;
                } else if (response.data.is_playing && response.data.is_member){
                    update.isAuthorized = true;
                } else {
                    update.errorMessage = "The room is already in-game."
                }

                // if the room is password protected - 
                if (!response.data.has_password) {
                    update.passwordRequired = false;
                }

                update.name = response.data.name

                this.setState(update);
            } 
        }).catch(error => {
            this.setState({errorMessage:"There was an error trying to join the room."});
        });

        
    }

    componentDidUpdate(prevProps, prevState){

        // only bother checking if new socket message is available
        if ( prevProps.socket.message_number != this.props.socket.message_number ){

            if (this.props.socket.type == 'JOIN_ROOM'){
                // updte state according to success of socket join room
                if (this.props.socket.message && this.props.socket.message.is_successful) {
                    this.setState({
                            attemptingJoin: false,
                            attemptedJoin: true,
                            didJoin:true
                        });
                } else {
                    this.setState({
                        attemptingJoin: false,
                        attemptedJoin: true,
                        didJoin: false
                    });
                }

            } else if (this.props.socket.type == 'UPDATE_ROOM') {
                this.updateRoomHandle();
            }
        }
        // if the user hasnt joined a room yet, emit a join room request to the socket
        if (!this.state.didJoin){
            if (this.state.isAuthorized && ((this.state.passwordRequired && this.state.passwordVerified) || !this.state.passwordRequired) ){

                if (!this.state.attemptingJoin){
                    this.setState({
                        attemptingJoin: true
                    }, this.joinRoomEmit());
                }
                
            }
        }

    }

    componentWillUnmount(){
        this.leaveRoomEmit();
    }



    /*

    PASSWORD FUNCTIONS - these are to sync the http verification with the socket verification
    
    */
    // callback for Password component
    verifyPassword(){
        this.setState({passwordVerified: true});
    }
    updatePassword(password){
        this.setState({passwordInput: password});
    }
    

    /*
    SOCKET HANDLERS
    */
    joinRoomEmit(){

        this.props.socket.instance.send(
            JSON.stringify({
                'type': 'JOIN_ROOM', 
                'room_id': this.props.match.params.id,
                'data': {
                    "password": this.state.passwordInput
                }
               
            })
        );

    }
    leaveRoomEmit(){
        this.props.socket.instance.send(
            JSON.stringify({
                'type': 'LEAVE_ROOM', 
                'room_id': this.props.match.params.id,
                'data': {}
            })
        );
    }


    // how to handle any room updates
    updateRoomHandle(){
        console.log('UPDATING ROOM')
    }


    render() {
        const { socket, gameComponent: Component } = this.props;
        const { passwordRequired, passwordVerified, isAuthorized, didJoin, attemptedJoin, name, errorMessage } = this.state;

        // the game is underway, but the user is not a player of the game
        if ( !isAuthorized ){
            return (
                <div>{errorMessage}</div>
            );
        }

        // if password is required, render password component
        if ( passwordRequired && !passwordVerified) {
            return <Password room_id={this.props.match.params.id} verifyPassword={this.verifyPassword} updatePassword={this.updatePassword}/>;

        } else if ( !passwordRequired || passwordVerified) {

            // successfully passed password requirements and recognized by socket
            if ( didJoin ){

                return <Component socket={socket} room_id={this.props.match.params.id}/>;

            } else if (attemptedJoin) {
                return (
                    "Failed to join room. Refresh the page."
                );
            } else {
                return (
                    "Joining room..."
                );
            }

        }
        
    }
}

export default Room;
