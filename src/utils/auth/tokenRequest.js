import {customAxios as axios} from 'utils/axios'

/* 
input credentials to get refresh and access tokens 

returns {
	access: str
	refresh: str
}
*/
async function requestTokensWithCredentials(username, password){
	return await axios.post('api/token/', {
			username:username, 
			password:password
		}).then(response => {
			return Promise.resolve(response.data);
		}).catch(error => {
			// make errors generic
			if (error.response && error.response.status == 401){
				return Promise.reject('Incorrect username or password.');
			}
			return Promise.reject('An unknown problem has occurred.');
		});
}


// given a refresh token, requests a new access token from server. returns access token
async function requestRefreshedAccessToken(refreshToken) {

	return await axios.post('api/token/refresh/', {
		refresh: refreshToken
	}).then(response => {
		return Promise.resolve(response.data.access)
	}).catch(error => {
		return Promise.reject(error)
	});
}




export {
	requestRefreshedAccessToken,
	requestTokensWithCredentials
}