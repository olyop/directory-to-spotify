import { FileSystemItemCustom } from "../types";

export const flattenFileSystem = (fileSystem: FileSystemItemCustom[]) => {
	const fileSystemItems: FileSystemItemCustom[] = [];

	for (const fileSystemItem of fileSystem) {
		if (fileSystemItem.children === null) {
			fileSystemItems.push(fileSystemItem);
		} else {
			fileSystemItems.push(...flattenFileSystem(fileSystemItem.children));
		}
	}

	return fileSystemItems;
};
