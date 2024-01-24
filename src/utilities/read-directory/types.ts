export interface FileSystemValue {
	skip: boolean;
	isExpanded: boolean;
	value: FileSystemFileHandle | FileSystem;
}

export type FileSystem = Map<string, FileSystemValue>;
