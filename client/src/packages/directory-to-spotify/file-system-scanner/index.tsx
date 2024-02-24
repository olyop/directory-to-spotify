import { FC } from "react";

import { FileSystemItemCustom } from "../types";
import { flattenFileSystem } from "./flatten-file-system";
import { MetadataScannerWebWorkerProvider } from "./metadata-scanner-worker-provider";

export const FileSystemScanner: FC<FileSystemScannerProps> = ({ fileSystem }) => {
	const flattenedFileSystem = flattenFileSystem(fileSystem);

	return (
		<MetadataScannerWebWorkerProvider>
			<pre className="w-full h-ull p-8 overflow-y-scroll">{JSON.stringify(flattenedFileSystem, null, 2)}</pre>
		</MetadataScannerWebWorkerProvider>
	);
};

export interface FileSystemScannerProps {
	fileSystem: FileSystemItemCustom[];
}
