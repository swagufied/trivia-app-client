import TokenDispatch from 'redux/auth'
import TokenUtils from 'utils/token_management'
import axios from 'axios'

let isAlreadyFetchingAccessToken = false;
let subscribers = [];

// this function will be called when axios gets a 401 response
async function refreshTokenAndReattemptRequest(error) {
	try {
		const { response: errorResponse } = error;
		const refreshToken = TokenUtils.getRefreshToken();
		if (!refreshToken) {
			TokenDispatch.refresh();
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
				const response = await TokenUtils.refreshToken();
				const newRefreshToken = response.data.access;
				TokenUtils.saveRefreshToken(newRefreshToken);
				TokenDispatch.
				isAlreadyFetchingAccessToken = false;
				onAccessTokenFetched(newRefreshToken);
			} catch(err) {
				TokenDispatch.refresh();
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