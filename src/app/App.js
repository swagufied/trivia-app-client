import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";

import Room from "./Room";
import Login from "./auth/Login";
import Register from "./auth/Register";
import Error404 from "./Errors";

import AuthenticatedRoute from "./auth/AuthenticatedRoute";
import axios from 'axios';
import AuthToken from '../utils/tokenManagement';


import Navbar from "./Navbar";


axios.interceptors.request.use(function (config) {
  console.log('request inceptor')
    const token = AuthToken.get(AuthToken.accessTokenKey);
    config.headers.Authorization = 'Bearer ' + token;

    return config;
}, function(error) {

  return Promise.reject();

});

axios.interceptors.response.use(function (response) {
    // Do something with response data - if access token was invalid - refresh it
    return response;
  }, async function (error) {
    // Do something with response error
    console.log('response interceptor', error, error.response)
    if (error.response.status == 401){
      console.log('401 error response interceptor')
      await AuthToken.refresh()
      return await AuthToken.verify();

      console.log('401 handled')
    }



    return Promise.reject();
  });


export default class App extends Component {

  render() {

    
      return (
        <div>
          <Navbar component={Navbar}/>
          <BrowserRouter>
              <Switch>
                <AuthenticatedRoute exact path="/"/>
                
                <Route exact path="/login" component={Login}/>
                <Route exact path="/register" component={Register}/>


                <AuthenticatedRoute exact path="/trivia/room/:id" component={Room} isSocketRoute={true} />
                <Route component={Error404}/>
              </Switch>
          </BrowserRouter>
        </div>
      );
      
  
  }
}
