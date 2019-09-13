import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';


import CircularProgress from '@material-ui/core/CircularProgress';

// import SocketCommand from './socket/Command';
// import SocketIndicator from './socket/Indicator';
// import initSocketFactory from '../redux/socket';
import Chat from './chat/Chat';
import Game from './trivia/Game';
import {isMapsEqual} from '../utils/comparisonUtils'



import axios from 'axios';
import {baseUrl} from './config'


import Password from './trivia/Password'


const maxJoinAttempts = 3; //TODO
class Room extends Component {

    constructor(props){
        super(props)

        this.state = {
            isAuthorized: false,

            passwordRequired: true,
            passwordVerified: false,
            passwordInput: "",
            errorMessage: "",

            attemptingJoin: false,
            attemptedJoin: false,
            didJoin: false,
            numJoinAttempts: 0,

            name: ""
        };

        this.verifyPassword = this.verifyPassword.bind(this);
        this.handlePasswordSubmit = this.handlePasswordSubmit.bind(this);
        this.handlePasswordInputChange = this.handlePasswordInputChange.bind(this);
    }


    /*

    LIFECYCLE FUNCTIONS
    
    */
    componentDidMount() {


        // get the room info
        axios.get(baseUrl + 'trivia/room/' + this.props.match.params.id)
        .then(response => {
            
            if (response.data){

                var update = {};

                // make sure the user is a member of the room if the room is in game
                if (!response.data.is_playing) {
                    update.isAuthorized = true;
                } else if (response.data.is_playing && response.data.is_member){
                    update.isAuthorized = true;
                }

                // if the room is password protected - 
                if (!response.data.has_password) {
                    update.passwordRequired = false;
                }

                update.name = response.data.name

                this.setState(update);

            } 
            


            console.log(response);
        }).catch(error => {
            console.log('error')
        });

        
    }

    componentDidUpdate(prevProps, prevState){

        // console.log(prevProps.socket.message, this.props.socket.message)
        if ( prevProps.socket.type != this.props.socket.type ||  !isMapsEqual(prevProps.socket.message, this.props.socket.message) ){

            if (this.props.socket.type == 'JOIN_ROOM'){
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

        if (!this.state.didJoin){
            if (this.state.isAuthorized && ((this.state.passwordRequired && this.state.passwordVerified) || !this.state.passwordRequired) ){

                if (!this.state.attemptingJoin){
                    this.setState({
                        attemptingJoin: true
                    }, this.joinRoomEmit());
                }
                
            }
        }
       

        
        


        // TODO: retry join room if it failed

    }

    componentWillUnmount(){
        this.leaveRoomEmit();
    }



    /*

    PASSWORD FUNCTIONS
    
    */
    verifyPassword(){
        // console.log(this, 'verifyPassword')
        this.setState({
            passwordVerified: true
        });
    }
    handlePasswordInputChange(event) {
        this.setState({passwordInput: event.target.value});
    }

    handlePasswordSubmit(event) {
        event.preventDefault();
        const this_ = this;

        axios.post(baseUrl + 'trivia/verify-room-password' , {
            room_id: this_.props.match.params.id,
            password: this_.state.passwordInput
        }).then( response => {
            console.log(response);
            if (response.data && response.data.is_successful) {
                this_.verifyPassword();
            } else {
                this_.setState({
                    errorMessage: response.data.error
                });
            }
        }).catch( error => {
            console.log('room password error', error);
        })
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

    joinRoomHandle(){

    }
    updateRoomHandle(){
        console.log('UPDATING ROOM')
    }


    render() {
        const { socket } = this.props;
        const { passwordRequired, passwordVerified, isAuthorized, didJoin, attemptedJoin, name } = this.state;

        if ( !isAuthorized ){
            return (
                "You dont have permission to this room"

            );
        }

        if ( passwordRequired && !passwordVerified) {
            return (
                <div>
                    <h1>Input Password: {name}</h1>
                    {this.state.errorMessage}
                    <form onSubmit={this.handlePasswordSubmit}>
                        <input type="text" value={this.state.passwordInput} onChange={this.handlePasswordInputChange} />
                        <input type="submit" value="send" />
                    </form>
                </div>
            );
        } else if ( !passwordRequired || passwordVerified) {

            if ( didJoin ){
                // PLUG IN GAME HERE
                return (
                    <div>

                        <Game  socket={socket} room_id={this.props.match.params.id} />
                        <Chat room_id={this.props.match.params.id} />

                    </div>
                );
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

// Room.propTypes = {
//     socket: PropTypes.object.isRequired,
//     refreshAuth: PropTypes.func.isRequired,
// };


const mapStoreToProps = store => store;
const mapDispatchToProps = dispatch => ({});

export default connect(mapStoreToProps, mapDispatchToProps)(Room);

// export default Room;

// const mapPropsToProps = store => store;
// const mapDispatchToProps = dispatch => ({
//     initSocket: initSocketFactory(dispatch),
// });

// export default connect(mapPropsToProps, mapDispatchToProps)(Room);
//mapStateToProps

                    // {!loading && <CardText><Grid matrix={game.matrix} /></CardText>}
