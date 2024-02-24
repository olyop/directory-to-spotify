import { determineFileSystemSize } from "packages/file-system-read-recursively/helpers";

import { FileSystemItemCustom } from "../types";

export const determineFileSystemSelected = (fileSystemItem: FileSystemItemCustom, shouldSkip: boolean) => {
	let selected = 0;

	const { handle, children, configuration } = fileSystemItem;

	const skipValue = shouldSkip || configuration.skip;

	if (!skipValue) {
		if (handle.kind === "directory" && children) {
			for (const child of children) {
				selected += determineFileSystemSelected(child, skipValue);
			}
		} else if (handle.kind === "file") {
			selected += 1;
		}
	}

	return selected;
};

export const determineFileSystemSizeCustom = (fileSystemItem: FileSystemItemCustom, shouldSkip: boolean) => {
	let size = 0;

	const { handle, children, size: sizeInput, configuration } = fileSystemItem;

	const skipValue = shouldSkip || configuration.skip;

	if (!skipValue) {
		if (handle.kind === "directory" && children) {
			for (const child of children) {
				size += determineFileSystemSize(child);
			}
		} else if (handle.kind === "file") {
			size += sizeInput;
		}
	}

	return size;
};
