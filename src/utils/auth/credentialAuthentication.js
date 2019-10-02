import {customAxios as axios} from 'utils/axios'
import {baseURL} from 'config'
import {dispatchAuthenticateUser, dispatchSetUser, dispatchAuthenticationError} from 'redux/auth/dispatch'
import {setAccessToken, setRefreshToken} from './tokenManagement'

// will update redux state to authenticated if dispatch is provided
async function requestTokenWithCredentials(username, password){
	return await axios.post(baseURL + 'api/token/', {
			username:username, 
			password:password
		}).then(response => {
			setAccessToken(response.data.access);
			setRefreshToken(response.data.refresh);
			
			dispatchAuthenticateUser();

			return Promise.resolve(response.data);
			
		}).catch(error => {
			console.log('requestTokenWithCredentials', error)
			if (error.response && error.response.status == 401){
				return Promise.reject('Incorrect username or password.');
			}
			
			return Promise.reject('An unknown problem has occurred.');
			
		});
}

async function verifyAccessToken(){

	return await axios.get(baseURL + 'trivia/token-verify/')
	.then(response => {
		return Promise.resolve(response);	
	}).catch(error => {
		console.log('access token couldnt be verified', error)
		return Promise.reject(error);
	});
}

async function verifyAuthenticationStatus(){

	// console.log(dispatch)
	await verifyAccessToken()
	.then(response => {
		dispatchAuthenticateUser();
		dispatchSetUser(response.data.user);
	}).catch(error => {
		console.log('Error verifying authentication status', error)
		dispatchAuthenticationError();
	});
}

export {
	requestTokenWithCredentials,
	verifyAuthenticationStatus
}
