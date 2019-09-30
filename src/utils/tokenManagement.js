// import LocalStorageValue from './localStorageUtils.js'
// import config from './appConfig'
// import {customAxios} from './axios';
// import actions from "../redux/auth/actions"
// import {store} from "../redux/configureStore";
// import axios from 'axios'

// async function verifyAuthenticationStatus(dispatch){

// 	dispatch = store.dispatch;
// 	// console.log(dispatch)
// 	await verifyToken()
// 	.then(response => {
// 		dispatch(actions.authenticateUser());
// 		dispatch(actions.setUser(response.data));
// 	}).catch(error => {
// 		console.log('Error verifying authentication status', error)
// 		dispatch(actions.error(error));
// 	});
// }

// async function refreshAuthenticationStatus(dispatch) {

// 	await refreshToken()
// 	.then(async response => {

// 		await verifyToken()
// 		.then(response => {

// 			// update user info and update state to authenticated
// 			dispatch(actions.authenticateUser());
// 			dispatch(actions.setUser(response.data)) 

// 		}).catch(error => {
// 			// set state as not authenticated
// 			console.log(error);
// 			dispatch(actions.error(error));

// 		});


// 	}).catch(error => {
// 		// set state as not authenticated
// 		console.log(error);
// 		dispatch(actions.error(error));

// 	});
	

// }



// // will update redux state to authenticated if dispatch is provided
// async function requestTokenWithCredentials(username, password, dispatch){
// 	return await axios.post(config.baseUrl + 'api/token/', {
// 			username:username, 
// 			password:password
// 		}).then(response => {

// 			setToken(accessTokenKey, response.data.access);
// 			setToken(refreshTokenKey, response.data.refresh);
			
// 			if (dispatch) dispatch(actions.authenticateUser());

// 			return Promise.resolve(response.data);
			
// 		}).catch(error => {

// 			if (error.response && error.response.status == 401){
// 				return Promise.reject('Incorrect username or password.');
// 			}
			
// 			return Promise.reject('An unknown problem has occurred.');
			
// 		});
// }




// // HANDLING TOKEN STORAGE FXNS
// const getToken = (tokenKey) => {
// 	return LocalStorageValue.get(tokenKey)
// }

// const setToken = (key, value) => {
// 	LocalStorageValue.set(key, value)
// }

// const getAccessToken = () => {
// 	return LocalStorageValue.get(accessTokenKey)
// }

// const getRefreshToken = () => {
// 	return LocalStorageValue.get(refreshTokenKey)
// }

// // HANDLEING TOKEN VERIFICATION
// var accessTokenKey = 'access-key'; // will return user info upon success
// var refreshTokenKey = 'refresh-key'; // will return access key upon success

// const verifyTokenUrl = config.baseUrl + 'trivia/token-verify/';
// const refreshTokenUrl = config.baseUrl + 'api/token/refresh/';


// async function verifyToken(){

// 	return await axios.get(verifyTokenUrl)
// 	.then(response => {
// 		return Promise.resolve(response.data);	
// 	}).catch(error => {
// 		return Promise.reject("Access token could not be verified.");
// 	});
// }

// async function refreshToken() {

// 	return await axios.post(refreshTokenUrl, {
// 		refresh: getToken(refreshTokenKey)
// 	}).then(response => {
// 		// setToken(accessTokenKey, response.data.access);
// 		return response

// 	}).catch(error => {
// 		console.log("Access token could not be refreshed.")
// 		return error
// 	});
// }


// export default {
// 	accessTokenKey: accessTokenKey,
// 	refreshTokenKey: refreshTokenKey,
// 	getRefreshToken: getRefreshToken,
// 	getAccessToken: getAccessToken,
// 	get: getToken,
// 	set: setToken,
// 	verify: verifyAuthenticationStatus,
// 	refresh: refreshToken,
// 	request: requestTokenWithCredentials
// }	