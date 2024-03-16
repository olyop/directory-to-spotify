import { calculateFileSystemReadCount } from "./helpers";
import {
	FileSystemReadDirectory,
	FileSystemReadDirectoryChildren,
	FileSystemReadFile,
	FileSystemReadFunctionBaseOptions,
	FileSystemReadOptions,
} from "./types";

export { calculateFileSystemReadCount };
export * from "./types";

export async function fileSystemRead<Properties>(options?: FileSystemReadOptions<Properties>) {
	checkBrowserSupport();

	const directoryHandle = await getDirectoryHandle();

	options?.onDirectoryChosen?.();

	if (directoryHandle === null) {
		return null;
	}

	const fileSystemReadDirectory: FileSystemReadDirectory<Properties> = {
		path: directoryHandle.name,
		handle: directoryHandle,
		isSelected: true,
		properties: options?.properties
			? options.properties({ isRoot: true, file: null, handle: directoryHandle })
			: ({} as Properties),
		isOpen: true,
		children: await readDirectoryChildren<Properties>(directoryHandle, options),
	};

	return fileSystemReadDirectory;
}

function checkBrowserSupport() {
	if (!("showDirectoryPicker" in window)) {
		throw new Error("showDirectoryPicker is not supported");
	}
}

async function getDirectoryHandle() {
	let directoryHandle: FileSystemDirectoryHandle | null = null;

	try {
		directoryHandle = await window.showDirectoryPicker();
	} catch (error) {
		if (error instanceof Error && error.message === "The user aborted a request.") {
			return null;
		}

		throw error;
	}

	await verifyHandlePermission(directoryHandle);

	return directoryHandle;
}

async function verifyHandlePermission(handle: FileSystemHandle) {
	if (
		!((await handle.queryPermission({ mode: "read" })) === "granted") ||
		!((await handle.requestPermission({ mode: "read" })) === "granted")
	) {
		throw new Error("Permission denied");
	}
}

async function readDirectoryChildren<Properties>(
	directoryHandle: FileSystemDirectoryHandle,
	options: FileSystemReadOptions<Properties> | undefined,
) {
	let directoryChildren: FileSystemReadDirectoryChildren<Properties> = null;

	for await (const handle of directoryHandle.values()) {
		options?.signal?.throwIfAborted();

		const path = `${directoryHandle.name}/${handle.name}`;

		if (directoryChildren === null) {
			directoryChildren = [];
		}

		const functionBaseOptions: FileSystemReadFunctionBaseOptions = {
			handle,
			isRoot: false,
			file: handle.kind === "file" ? await handle.getFile() : null,
		};

		const properties = options?.properties ? options.properties(functionBaseOptions) : ({} as Properties);

		const functionOptions = { ...functionBaseOptions, properties };

		const ignore = options?.ignore ? options.ignore(functionOptions) : false;

		if (!ignore) {
			const isSelected = options?.selected ? options.selected(functionOptions) : true;

			if (handle.kind === "directory") {
				const children = await readDirectoryChildren<Properties>(handle, options);

				const directory: FileSystemReadDirectory<Properties> = {
					path,
					handle,
					isSelected,
					properties,
					children,
					isOpen: false,
				};

				directoryChildren.push(directory);
			} else {
				const file: FileSystemReadFile<Properties> = {
					path,
					handle,
					isSelected,
					properties,
				};

				directoryChildren.push(file);
			}
		}
	}

	return directoryChildren;
}
