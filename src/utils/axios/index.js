import axios from 'axios';
import {refreshTokenAndReattemptRequest} from 'utils/auth/responseHandlers'
import {getAccessToken} from 'utils/auth/tokenManagement'

// to avoid modifying the base axios instance
const customAxios = axios.create({
	baseURL: 'http://127.0.0.1:8000/'
})

export {
	customAxios
}

// if token has been called within t time, call the function in interval

customAxios.interceptors.request.use(
	function (config) {
	    const token = getAccessToken();
	    config.headers.Authorization = 'Bearer ' + token;
	    console.log(config)
	    return config;
	}
);


customAxios.interceptors.response.use(
	function(response) {
		// If the request succeeds, we don't have to do anything and just return the response
		return response
	},
	function(error) {


		if (error.response.state == 401){
			console.log('attempting to refresh token and reattempt request')
			return refreshTokenAndReattemptRequest(error)
		}
		return Promise.reject(error);
	}
)
