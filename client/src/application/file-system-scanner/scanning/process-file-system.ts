import {
	FileSystemReadDirectoryCustom,
	FileSystemReadFileCustom,
	FileSystemReadItemCustom,
	WorkItem,
	WorkItemFile,
} from "../../types";
import metadatScannerWorkerUrl from "./metadata-scanner?worker&url";
import { MetadataScannerWorkerInput, MetadataScannerWorkerOutput } from "./types";

export async function processFileSystem(options: ProcessFileSystemOptions) {
	const worker = new Worker(metadatScannerWorkerUrl, {
		type: "module",
		name: "metadata-scanner",
	});

	try {
		await processItem(options, worker);
	} finally {
		worker.terminate();
	}
}

export async function processItem(options: ProcessFileSystemItemOptions, worker: Worker) {
	if (!options.fileSystemItem.isSelected) return;

	if (isFile(options)) {
		await processFile(options, worker);
	} else if (isDirectory(options)) {
		await processDirectory(options, worker);
	}
}

async function processDirectory(options: ProcessFileSystemOptions, worker: Worker) {
	if (options.fileSystemItem.children === null) return;

	for (const fileSystemItem of options.fileSystemItem.children) {
		await processItem({ ...options, fileSystemItem }, worker);
	}
}

async function processFile(options: ProcessFileSystemFileOptions, worker: Worker) {
	options.signal.throwIfAborted();

	const file = await options.fileSystemItem.handle.getFile();
	const arrayBuffer = await file.arrayBuffer();

	const input: MetadataScannerWorkerInput = {
		path: options.fileSystemItem.path,
		format: file.type,
		data: arrayBuffer,
	};

	const transferables: Transferable[] = [arrayBuffer];

	const result = await processWorkerResponse<MetadataScannerWorkerOutput>(worker, input, transferables);

	if ("error" in result) {
		throw new Error(result.error);
	}

	void options.onWorkItem(result.workItem, result.workItemFiles);
}

function isFile(options: ProcessFileSystemItemOptions): options is ProcessFileSystemFileOptions {
	return !isDirectory(options);
}

function isDirectory(options: ProcessFileSystemItemOptions): options is ProcessFileSystemOptions {
	return "fileSystemItem" in options && "children" in options.fileSystemItem;
}

async function processWorkerResponse<Output>(worker: Worker, input: unknown, transferables: Transferable[]) {
	return new Promise<Output>((resolve, reject) => {
		worker.addEventListener("error", event => {
			reject(new Error(event.message));
		});

		worker.addEventListener("message", event => {
			resolve(event.data as Output);
		});

		worker.postMessage(input, transferables);
	});
}

export interface ProcessFileSystemBaseOptions {
	signal: AbortSignal;
	onWorkItem: (workItem: WorkItem, workItemFiles: WorkItemFile[]) => Promise<void>;
}

interface ProcessFileSystemItemBaseOptions<T> extends ProcessFileSystemBaseOptions {
	fileSystemItem: T;
}

export interface ProcessFileSystemItemOptions extends ProcessFileSystemItemBaseOptions<FileSystemReadItemCustom> {}
export interface ProcessFileSystemFileOptions extends ProcessFileSystemItemBaseOptions<FileSystemReadFileCustom> {}
export interface ProcessFileSystemOptions extends ProcessFileSystemItemBaseOptions<FileSystemReadDirectoryCustom> {}
