export const convertSetToArray = <T>(set: Set<T>) => {
	const array: T[] = [];

	for (const value of set) {
		array.push(value);
	}

	return array;
};
