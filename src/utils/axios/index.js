import axios from 'axios';
import TokenUtils from '../tokenManagement'
import {refreshTokenAndReattemptRequest} from 'utils/token_management/responseHandlers'

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
	    const token = TokenUtils.getAccessToken();
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


		if (error.response.state == 401){
			return TokenUtils.refreshTokenAndReattemptRequest(error)
		}
		return Promise.reject(error);
	}
)
