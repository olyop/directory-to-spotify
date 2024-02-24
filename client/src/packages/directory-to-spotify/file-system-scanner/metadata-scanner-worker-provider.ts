import { FC, PropsWithChildren, useEffect, useRef } from "react";

// const workerTest = (workerRef: Worker) => {
// 	workerRef.postMessage("test");
// };

export const MetadataScannerWebWorkerProvider: FC<PropsWithChildren> = ({ children }) => {
	const workerRef = useRef(new Worker("/metadata-scanner.js"));

	useEffect(
		() => () => {
			workerRef.current.terminate();
		},
		[],
	);

	return children;
};
