

const setLocalStorageValue = (key, value) => {
	localStorage.setItem(key, value);
	console.log('local storage value set', key, value);	   
}

const getLocalStorageValue = (key) => {
	return localStorage.getItem(key);
}

export default {
	set: setLocalStorageValue,
	get: getLocalStorageValue
}
