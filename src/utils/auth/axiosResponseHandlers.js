import {dispatchResetAuth} from 'redux/auth/dispatch'
import {customAxios as axios} from 'utils/axios'
import {setAccessToken, getRefreshToken} from './tokenGetSet'
import {requestRefreshedAccessToken} from './tokenRequest'
import {updateAuthenticationStatus} from './verificationFunctions'

let isAlreadyFetchingAccessToken = false;
let delaySet = false;
let maxRetries = 3
let currRetries = 0
let subscribers = [];
let initialDelayInterval = 1000
let currentDelayInterval = initialDelayInterval

// this function will be called when axios gets a 401 response - this will request a refresh token and reattempt the request
async function refreshTokenAndReattemptRequest(error) {
	try {
		const { response: errorResponse } = error;
		const refreshToken = getRefreshToken();

		// if there is no refresh token
		if (!refreshToken) {
			dispatchResetAuth();
			return Promise.reject(error);
		}

		// add request to queue
		const retryOriginalRequest = new Promise(resolve => {
			console.log(errorResponse.config)
			addSubscriber(access_token => {
				// errorResponse.config.headers.Authorization = 'Bearer ' + access_token;
				resolve(axios(errorResponse.config));
			});
		});

		console.log('subscribers', subscribers)

		// if there is no refresh attempt planned and not too many requests were made
		if (!isAlreadyFetchingAccessToken && !delaySet) {
			isAlreadyFetchingAccessToken = true;

			if (currRetries < maxRetries){
				currRetries++
				try {
					const access_token = await requestRefreshedAccessToken(refreshToken);
					setAccessToken(access_token)
					updateAuthenticationStatus(); // get user information and update redux auth store
					
					isAlreadyFetchingAccessToken = false;
					onAccessTokenFetched(access_token);
					currRetries = 0
				} catch(err) {

					delaySet=true
					setTimeout(error => reattemptRefreshToken, currentDelayInterval)

					return Promise.reject(err);
				}
			} else {
				return Promise.reject('Too many refresh attempts were made.')
			}
			
		}
		return retryOriginalRequest;
	} catch (err) {
		return Promise.reject(err);
	}
}

function reattemptRefreshToken(error){
	console.log(`Refresh access token: retry in ${currentDelayInterval}ms`,error);
	refreshTokenAndReattemptRequest(error)
	delaySet = false
}

// when access token is refreshed, this fxn will reattempt the unauthorized requests
function onAccessTokenFetched(access_token) {
	// When the refresh is successful, we start retrying the requests one by one and empty the queue
  subscribers.forEach(callback => callback(access_token));
  subscribers = [];
}

// add request to queue
function addSubscriber(callback) {
  subscribers.push(callback);
}


export {
	refreshTokenAndReattemptRequest
}