import LocalStorageValue from './localStorageUtils.js'
import config from './appConfig'
import axios from 'axios';
import actions from "../redux/auth/actions"
import {store} from "../redux/configureStore";



axios.interceptors.request.use(function (config) {
    const token = getToken(accessTokenKey);
    config.headers.Authorization = 'Bearer ' + token;
    return config;
});

axios.interceptors.response.use(function (response) {
    return response;
  }, async function (error) {

    console.log('response interceptor', error, error.response)
    if (error.response && error.response.status == 401){
    	console.log('401 error response interceptor')
    	await refreshAuthenticationStatus(store.dispatch);
  	}

    return Promise.reject("something went wrong");
  });

async function verifyAuthenticationStatus(dispatch){

	dispatch = store.dispatch;
	console.log(dispatch)
	await verifyToken()
	.then(response => {
		dispatch(actions.authenticateUser());
		dispatch(actions.setUser(response.data));
	}).catch(error => {
		console.log('Error verifying authentication status', error)
		dispatch(actions.error(error));
	});
}

async function refreshAuthenticationStatus(dispatch) {

	await refreshToken()
	.then(async response => {

		await verifyToken()
		.then(response => {

			// update user info and update state to authenticated
			dispatch(actions.authenticateUser());
			dispatch(actions.setUser(response.data))

		}).catch(error => {
			// set state as not authenticated
			console.log(error);
			dispatch(actions.error(error));

		});


	}).catch(error => {
		// set state as not authenticated
		console.log(error);
		dispatch(actions.error(error));

	});
	

}



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
var accessTokenKey = 'access-key'; // will return user info upon success
var refreshTokenKey = 'refresh-key'; // will return access key upon success

const verifyTokenUrl = config.baseUrl + 'trivia/token-verify/';
const refreshTokenUrl = config.baseUrl + 'api/token/refresh/';


async function verifyToken(){

	return await axios.get(verifyTokenUrl)
	.then(response => {
		return Promise.resolve(response.data);	
	}).catch(error => {
		return Promise.reject("Access token could not be verified.");
	});
}

async function refreshToken() {

	return await axios.post(refreshTokenUrl, {
		refresh: getToken(refreshTokenKey)
	}).then(response => {
		setToken(accessTokenKey, response.data.access);
		return Promise.resolve(response.data);

	}).catch(error => {
		return Promise.reject("Access token could not be refreshed.");
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
	verify: verifyAuthenticationStatus,
	refresh: refreshToken,
	request: requestTokenWithCredentials
}	