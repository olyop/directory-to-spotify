import { FileSystemMap } from "layouts/directory-chooser/types";

import { FileSystemArrayItem } from "./types";

export const convertFileSystemToArray = (map: FileSystemMap) => {
	const array: FileSystemArrayItem[] = [];

	for (const [key, value] of map) {
		array.push({
			key,
			value,
			map,
		});
	}

	return array;
};
