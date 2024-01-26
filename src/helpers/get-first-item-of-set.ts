export const getFirstItemOfSet = <T>(set: Set<T>) => {
	let value: T | null = null;

	// eslint-disable-next-line no-unreachable-loop
	for (const item of set) {
		value = item;
		break;
	}

	if (value === null) {
		throw new Error("Set is empty");
	}

	return value;
};
