import LocalStorageValue from './localStorageUtils.js'
import config from './appConfig'
import axios from 'axios';
import actions from "../redux/auth/actions"

class AuthenticationError extends Error {

	// types - UNKNOWN, INVALID_REFRESH, INVALID_ACCESS

	constructor(...args) {
        super(...args);
        Error.captureStackTrace(this, AuthenticationError);

        this.type = args[0];
        this.msg = args[1];
    }
}


axios.interceptors.request.use(function (config) {
  console.log('request inceptor')
    const token = getToken(accessTokenKey);
    config.headers.Authorization = 'Bearer ' + token;
    return config;
});

axios.interceptors.response.use(function (response) {
    // Do something with response data - if access token was invalid - refresh it
    return response;
  }, async function (error) {
    // Do something with response error
    console.log('response interceptor', error, error.response)
    if (error.response && error.response.status == 401){
      console.log('401 error response interceptor')
      const response = await refreshToken()
      if (response ){
        return await verifyToken();
      }
      

      console.log('401 handled')
    }



    return Promise.reject("something went wrong");
  });



// will update redux state to authenticated if dispatch is provided
async function requestTokenWithCredentials(username, password, dispatch){
	return await axios.post(config.baseUrl + 'api/token/', {
			username:username, 
			password:password
		}).then(response => {

			setToken(accessTokenKey, response.data.access);
			setToken(refreshTokenKey, response.data.refresh);
			
			if (dispatch) dispatch(actions.authenticateUser());

			return Promise.resolve(response.data);
			
		}).catch(error => {

			if (error.response && error.response.status == 401){
				return Promise.reject('Incorrect username or password.');
			}
			
			return Promise.reject('An unknown problem has occurred.');
			
		});
}




// HANDLING TOKEN STORAGE FXNS
const getToken = (tokenKey) => {
	return LocalStorageValue.get(tokenKey)
}

const setToken = (key, value) => {
	LocalStorageValue.set(key, value)
}



// HANDLEING TOKEN VERIFICATION
var accessTokenKey = 'access-key';
var refreshTokenKey = 'refresh-key';

// const verifyTokenUrl = config.baseUrl + 'trivia/token-verify/';
// const refreshTokenUrl = config.baseUrl + 'api/token/refresh/';


async function verifyToken(){
	console.log('in verify token')
	const verifyTokenUrl = config.baseUrl + 'trivia/token-verify/';
	return await axios.get(verifyTokenUrl).then(response => {
		console.log('access token successfully verified', response)
		return response.data;	
	});
}

async function refreshToken() {

	const refreshTokenUrl = config.baseUrl + 'api/token/refresh/';
	const refreshToken = getToken(refreshTokenKey);

	return await axios.post(refreshTokenUrl, {
		refresh:refreshToken
	}).then(response => {
		setToken(accessTokenKey, response.data.access);

		return response.data;

	});
}

// const verifyToken = (callback) => {

// 	return axios.get(verifyTokenUrl).then(response => {
// 			console.log('access token successfully verified', response)
// 			// setToken(accessTokenKey, response.data.access);

// 			if(callback && typeof callback === "function") {
// 				callback(response.data);
// 			}

// 			return response.data;

			
// 		}).catch(error => { 

// 			// if access token is no longer valid
// 			if (error.response.status == 401){

// 				const refreshToken = getToken(refreshTokenKey);

// 				return axios.post(refreshTokenUrl, {
// 					refresh:refreshToken
// 				}).then(response => {
// 					setToken(accessTokenKey, response.data.access);

// 					if(callback && typeof callback === "function") {
// 						callback(response.data);
// 					}
					
// 				}).catch(error => {
					
// 					// refresh token is no longer valid as well
// 					if (error.response.status == 401){
// 						return Promise.reject(new AuthenticationError('INVALID_REFRESH', 'Refresh token is invalid.'))
						
					
// 					} else {
// 						return Promise.reject(new AuthenticationError('UNKNOWN', 'An unknown error has occurred while validating user.'));
// 					}

// 				});

// 			} else {
					
// 				return Promise.reject(new AuthenticationError('UNKNOWN', 'An unknown error has occurred while validating user.'));

// 			}
// 		});

// }

export default {
	accessTokenKey: accessTokenKey,
	refreshTokenKey: refreshTokenKey,
	get: getToken,
	set: setToken,
	verify: verifyToken,
	refresh: refreshToken,
	request: requestTokenWithCredentials
}	