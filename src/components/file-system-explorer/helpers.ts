import { FileSystemItem } from "utilities/read-directory";

export const determineFileSystemSelected = (fileSystemItem: FileSystemItem) => {
	let selected = 0;

	const { skip, children } = fileSystemItem;

	if (!skip && children) {
		for (const child of children) {
			selected += determineFileSystemSelected(child);
		}
	}

	return selected;
};
