export const unPromisifyFunction = (promiseFunction: () => Promise<void>) => () => {
	void promiseFunction();
};
