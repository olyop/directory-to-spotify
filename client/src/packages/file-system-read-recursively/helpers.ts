import { FileSystemItem } from "./types";

export const determineFileSystemSize = <Configuration = null>(fileSystemItem: FileSystemItem<Configuration>) => {
	let size = 0;

	const { handle, children, size: sizeInput } = fileSystemItem;

	if (handle.kind === "directory" && children) {
		for (const child of children) {
			size += determineFileSystemSize(child);
		}
	} else if (handle.kind === "file") {
		size += sizeInput;
	}

	return size;
};
