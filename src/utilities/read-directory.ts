const verifyHandlePermission = async (handle: FileSystemHandle) => {
	if (
		!((await handle.queryPermission({ mode: "read" })) === "granted") ||
		!((await handle.requestPermission({ mode: "read" })) === "granted")
	) {
		throw new Error("Permission denied");
	}
};

const readFileSystemDirectoryRecursively = async (
	directoryHandle: FileSystemDirectoryHandle,
	parentDirectoryHandle: FileSystemDirectoryHandle = directoryHandle,
): Promise<FileSystemItemChildren> => {
	const fileSystem: FileSystemSet = new Set();

	for await (const handle of directoryHandle.values()) {
		const path = `${parentDirectoryHandle.name}/${handle.name}`;

		let children: FileSystemItemChildren;
		let skip: boolean;

		if (handle.kind === "directory") {
			children = await readFileSystemDirectoryRecursively(handle, directoryHandle);
			skip = false;
		} else {
			children = null;
			skip = !handle.name.endsWith(".mp3");
		}

		fileSystem.add({
			path,
			handle,
			children,
			skip,
			isExpanded: false,
		});
	}

	return fileSystem.size === 0 ? null : fileSystem;
};

export const executeDirectoryRead = async () => {
	const directoryHandle = await window.showDirectoryPicker();

	await verifyHandlePermission(directoryHandle);

	const baseFileSystem: FileSystemSet = new Set();

	baseFileSystem.add({
		path: directoryHandle.name,
		skip: false,
		isExpanded: true,
		handle: directoryHandle,
		children: await readFileSystemDirectoryRecursively(directoryHandle),
	});

	return baseFileSystem;
};

export type FileSystemItemChildren = FileSystemSet | null;

export interface FileSystemItemOptions {
	skip: boolean;
	isExpanded: boolean;
}

export interface FileSystemItem extends FileSystemItemOptions {
	path: string;
	handle: FileSystemHandle;
	children: FileSystemSet | null;
}

export type FileSystemSet = Set<FileSystemItem>;
