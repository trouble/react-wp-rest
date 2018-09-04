export const arrayToObject = (arr, key) => {
	return arr.reduce((obj, item) => {
		if (key) {
			obj[item[key]] = item;
			return obj;
		}

		obj[item] = {};
		return obj;
	}, {});
}

export const objectToArray = arr => {
	return Object.values(arr);
}

export const arrayToHash = (arr, key) => {
	return arr.reduce((obj, item, i) => {
		obj[item[key]] = i;
		return obj;
	}, {});
}
