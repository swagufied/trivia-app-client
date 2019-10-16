import LocalStorageValue from 'utils/localStorage'

var accessTokenKey = 'access-key'; // will return user info upon success
var refreshTokenKey = 'refresh-key'; // will return access key upon success

const getAccessToken = () => {
	return LocalStorageValue.get(accessTokenKey)
}

const setAccessToken = (value) => {
	LocalStorageValue.set(accessTokenKey, value)
}

const getRefreshToken = () => {
	return LocalStorageValue.get(refreshTokenKey)
}
const setRefreshToken = (value) => {
	LocalStorageValue.set(refreshTokenKey, value)
}




export {
	getAccessToken,
	setAccessToken,
	getRefreshToken,
	setRefreshToken
}