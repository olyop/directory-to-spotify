import { FileSystem } from "./types";

export const showDirectoryPicker = () =>
	window.showDirectoryPicker({
		id: "directory-read",
		mode: "read",
	});

export const verifyHandlePermission = async (handle: FileSystemHandle) => {
	if ((await handle.queryPermission()) === "granted") {
		return true;
	}

	if ((await handle.requestPermission()) === "granted") {
		return true;
	}

	return false;
};

export const readDirectoryRecursively = async (
	fileSystem: FileSystem,
	directoryHandle: FileSystemDirectoryHandle,
	directoryPath: string = directoryHandle.name,
) => {
	for await (const handle of directoryHandle.values()) {
		const path = `${directoryPath}/${handle.name}`;

		if (handle.kind === "directory") {
			const subFileSystem: FileSystem = new Map();

			await readDirectoryRecursively(subFileSystem, handle, path);

			fileSystem.set(path, {
				skip: false,
				isExpanded: false,
				value: subFileSystem,
			});
		} else {
			fileSystem.set(path, {
				skip: !path.endsWith(".mp3"),
				isExpanded: false,
				value: handle,
			});
		}
	}
};

export const readDirectory = async () => {
	let directoryHandle: FileSystemDirectoryHandle;

	try {
		directoryHandle = await showDirectoryPicker();
	} catch {
		return null;
	}

	if (!(await verifyHandlePermission(directoryHandle))) {
		return null;
	}

	const childFileSystem: FileSystem = new Map();

	const fileSystem: FileSystem = new Map();

	await readDirectoryRecursively(fileSystem, directoryHandle);

	childFileSystem.set(directoryHandle.name, {
		skip: false,
		isExpanded: true,
		value: fileSystem,
	});

	return childFileSystem;
};
