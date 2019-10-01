import {dispatchRefreshAuth} from 'redux/auth/dispatch'
import axios from 'axios'
import {setAccessToken, getRefreshToken} from './tokenManagement'
import {refreshAccessToken} from './tokenRequest'
import {verifyAuthenticationStatus as updateUserStore} from './tokenRequest'

let isAlreadyFetchingAccessToken = false;
let subscribers = [];

// this function will be called when axios gets a 401 response - this will request a refresh token and reattempt the request
async function refreshTokenAndReattemptRequest(error) {
	try {
		const { response: errorResponse } = error;
		const refreshToken = getRefreshToken();

		// if there is no refresh token
		if (!refreshToken) {
			dispatchRefreshAuth();
			return Promise.reject(error);
		}

		const retryOriginalRequest = new Promise(resolve => {
			addSubscriber(access_token => {
				// errorResponse.config.headers.Authorization = 'Bearer ' + access_token;
				resolve(axios(errorResponse.config));
			});
		});

		if (!isAlreadyFetchingAccessToken) {
			isAlreadyFetchingAccessToken = true;

			try {
				const accessToken = await refreshAccessToken();
				const newAccessToken = accessToken;
				setAccessToken(newAccessToken);

				// get user information and update redux auth store
				updateUserStore();

				
				isAlreadyFetchingAccessToken = false;
				onAccessTokenFetched(newAccessToken);
			} catch(err) {
				dispatchRefreshAuth();
				return Promise.reject(error);
			}
			
		}
		return retryOriginalRequest;
	} catch (err) {
		return Promise.reject(err);
	}
}

function onAccessTokenFetched(access_token) {
	// When the refresh is successful, we start retrying the requests one by one and empty the queue
  subscribers.forEach(callback => callback(access_token));
  subscribers = [];
}

function addSubscriber(callback) {
  subscribers.push(callback);
}


export {
	refreshTokenAndReattemptRequest
}