export interface FileSystemItem {
	skip: boolean;
	isExpanded: boolean;
	fileSystem: FileSystemFileHandle | FileSystemMap;
}

export type FileSystemMap = Map<string, FileSystemItem>;
