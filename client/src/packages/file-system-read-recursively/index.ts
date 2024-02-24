import { ExecuteDirectoryReadOptions, FileSystemItem, FileSystemItemChildren } from "./types";

export * from "./types";
export * from "./helpers";

const verifyHandlePermission = async (handle: FileSystemHandle) => {
	if (
		!((await handle.queryPermission({ mode: "read" })) === "granted") ||
		!((await handle.requestPermission({ mode: "read" })) === "granted")
	) {
		throw new Error("Permission denied");
	}
};

const readDirectoryRecursively = async <Configuration = null>(
	directoryHandle: FileSystemDirectoryHandle,
	options: ExecuteDirectoryReadOptions<Configuration> | undefined,
	parentDirectoryHandle: FileSystemDirectoryHandle = directoryHandle,
) => {
	const fileSystem: FileSystemItem<Configuration>[] = [];

	for await (const handle of directoryHandle.values()) {
		const isRoot = false;
		const path = `${parentDirectoryHandle.name}/${handle.name}`;

		let size: number | null = null;
		let configuration = null as Configuration;
		let children: FileSystemItemChildren<Configuration>;

		let ignore: boolean = false;
		let file: File | null = null;

		if (handle.kind === "directory") {
			children = await readDirectoryRecursively<Configuration>(handle, options, parentDirectoryHandle);
		} else {
			file = await handle.getFile();

			size = file.size;

			children = null;
		}

		if (options?.configurationFunction) {
			configuration = options.configurationFunction({
				isRoot,
				file,
				handle,
			});
		}

		if (options?.ignoreFunction) {
			ignore = options.ignoreFunction({
				isRoot,
				file,
				handle,
				configuration,
			});
		}

		if (!ignore) {
			fileSystem.push({
				path,
				handle,
				size,
				configuration,
				children,
			});
		}
	}

	return fileSystem;
};

export const executeDirectoryRead = async <Configuration = null>(
	options?: ExecuteDirectoryReadOptions<Configuration>,
) => {
	if (!("showDirectoryPicker" in window)) {
		throw new Error("showDirectoryPicker is not supported");
	}

	const directoryHandle = await window.showDirectoryPicker();

	await verifyHandlePermission(directoryHandle);

	const baseFileSystem: FileSystemItem<Configuration>[] = [];

	const children = await readDirectoryRecursively<Configuration>(directoryHandle, options);

	baseFileSystem.push({
		path: directoryHandle.name,
		handle: directoryHandle,
		children,
		configuration:
			options?.configurationFunction?.({ isRoot: true, file: null, handle: directoryHandle }) ??
			(null as Configuration),
		size: null,
	});

	return baseFileSystem;
};
