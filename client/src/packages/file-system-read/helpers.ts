import { FileSystemReadDirectory } from "./types";

export const calculateFileSystemReadCount = <Properties>(fileSystem: FileSystemReadDirectory<Properties>) => {
	let count = 0;

	const { children, isSelected } = fileSystem;

	if (isSelected && children) {
		for (const child of children) {
			if (child.isSelected) {
				if (child.handle.kind === "directory") {
					if ("children" in child) {
						count += calculateFileSystemReadCount(child);
					}
				} else {
					count += 1;
				}
			}
		}
	}

	return count;
};
