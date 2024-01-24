import { FileSystemMap } from "./types";

const showDirectoryPicker = () =>
	window.showDirectoryPicker({
		mode: "read",
		id: "directory-read",
	});

const verifyHandlePermission = async (handle: FileSystemHandle) => {
	if ((await handle.queryPermission()) === "granted") {
		return true;
	}

	if ((await handle.requestPermission()) === "granted") {
		return true;
	}

	return false;
};

const readDirectoryRecursively = async (
	fileSystem: FileSystemMap,
	directoryHandle: FileSystemDirectoryHandle,
	directoryPath: string = directoryHandle.name,
) => {
	for await (const handle of directoryHandle.values()) {
		const path = `${directoryPath}/${handle.name}`;

		if (handle.kind === "directory") {
			const subFileSystem: FileSystemMap = new Map();

			await readDirectoryRecursively(subFileSystem, handle, path);

			fileSystem.set(path, {
				fileSystem: subFileSystem,
				skip: false,
				isExpanded: false,
			});
		} else {
			fileSystem.set(path, {
				fileSystem: handle,
				skip: !path.endsWith(".mp3"),
				isExpanded: false,
			});
		}
	}
};

export const executeDirectoryRead = async () => {
	let directoryHandle: FileSystemDirectoryHandle;

	try {
		directoryHandle = await showDirectoryPicker();
	} catch {
		return null;
	}

	if (!(await verifyHandlePermission(directoryHandle))) {
		return null;
	}

	const map: FileSystemMap = new Map();

	const fileSystem: FileSystemMap = new Map();

	await readDirectoryRecursively(fileSystem, directoryHandle);

	map.set(directoryHandle.name, {
		fileSystem,
		skip: false,
		isExpanded: true,
	});

	return map;
};
