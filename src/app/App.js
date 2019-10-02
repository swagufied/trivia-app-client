import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";

import Room from "./Room";
import Login from "./auth/Login";
import Register from "./auth/Register";
import Error404 from "./Errors";

import PrivateRoute from "./auth/AuthenticatedRoute";
import axios from 'axios';


import Navbar from "./Navbar";
import { connect } from 'react-redux';



class App extends Component {

  render() {

      const {auth} = this.props;

      return (
        <div>

          <Navbar component={Navbar}/>
          <BrowserRouter>
              <Switch>
                <Route exact path="/"/>
                
                <Route exact path="/login" component={Login}/>
                <Route exact path="/register" component={Register}/>


                <Route 
                  exact 
                  path="/trivia/room/:id" 
                  render={(props) => (<PrivateRoute authState={auth} isSocketRoute={true} {...props}  />) } 
                />

                
                <Route component={Error404}/>
              </Switch>
          </BrowserRouter>
        </div>
      );
      
  
  }
}

const mapStoreToProps = store => store;
const mapDispatchToProps = dispatch => ({
});

export default connect(mapStoreToProps, mapDispatchToProps)(App);
