import { FileSystemItem } from "packages/file-system-read-recursively";

export interface FileSystemConfiguration {
	skip: boolean;
	isExpanded: boolean;
}

export type FileSystemItemCustom = FileSystemItem<FileSystemConfiguration>;

export type FileSystemState = FileSystemItemCustom[] | Error | null;

export interface FileSystemItemIgnoreOptions {
	ignore: boolean;
}

export interface FileSystemItemIsExpandedOptions {
	isExpanded: boolean;
}
