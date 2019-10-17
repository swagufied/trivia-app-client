import {customAxios as axios} from 'utils/axios'
import {baseURL} from 'config'
import {dispatchAuthenticateUser, dispatchSetUser, dispatchAuthenticationError} from 'redux/auth/dispatch'
import {setAccessToken, setRefreshToken} from './tokenGetSet'
import {requestTokensWithCredentials} from './tokenRequest'


// verifies that an access token is valid. returns user info if verification successful
async function verifyAccessToken(){

	return await axios.get(baseURL + 'trivia/token-verify/')
	.then(response => {
		return Promise.resolve(response.data);	
	}).catch(error => {
		return Promise.reject(error);
	});
}

// verfies the access token and updates redux state user data from server response and isAuthenticated to true
async function updateAuthenticationStatus(){

	await verifyAccessToken()
	.then(data => {
		dispatchAuthenticateUser();
		dispatchSetUser(data.user);
		return Promise.resolve("Authentication successful")
	}).catch(error => {
		dispatchAuthenticationError();
		return Promise.reject("Authentication unsuccessful")
	});
}

// logs a user in. resets access and refresh tokens and updates redux auth state to isAuthenticated=true
async function login(username, password){

	await requestTokensWithCredentials(username,password)
	.then(token_data => {
		setAccessToken(token_data.access);
		setRefreshToken(token_data.refresh);
		dispatchAuthenticateUser();
		return Promise.resolve("Login successful")
	}).catch(error => {
		dispatchAuthenticationError();
		return Promise.reject("Login unsuccessful")
	})
	
}

export {
	updateAuthenticationStatus,
	login,
	verifyAccessToken
}
