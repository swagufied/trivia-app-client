import axios from 'axios';
import {refreshTokenAndReattemptRequest} from 'utils/auth/axiosResponseHandlers'
import {getAccessToken} from 'utils/auth/tokenGetSet'
import {baseURL} from 'config'

// to avoid modifying the base axios instance
const customAxios = axios.create({
	baseURL: baseURL
})

export {
	customAxios
}


customAxios.interceptors.request.use(
	function (config) {
	    const token = getAccessToken();
	    config.headers.Authorization = 'Bearer ' + token;
	    return config;
	}
);


customAxios.interceptors.response.use(
	function(response) {
		// If the request succeeds, we don't have to do anything and just return the response
		return response
	},
	function(error) {
		console.log('axiosResponseInterceptor', error)
		if (error.response.status == 401){
			console.log('attempting to refresh token and reattempt request')
			return refreshTokenAndReattemptRequest(error)
		}
		return Promise.reject(error);
	}
)
