import { FileSystemItem, FileSystemMap } from "layouts/directory-chooser/types";

export type FileSystemExplorerOnUpdateFileSystem = (
	fileSystemRoot: FileSystemMap,
	fileSystem: FileSystemMap,
	key: string,
) => void;

export interface FileSystemExplorerBaseProps {
	fileSystemRoot?: FileSystemMap;
	className?: string | undefined;
	onUpdateFileSystem: FileSystemExplorerOnUpdateFileSystem;
}

export interface FileSystemExplorerDirectoryBaseProps extends FileSystemExplorerBaseProps {
	fileSystemRef: FileSystemMap;
}

export interface FileSystemArrayItem {
	key: string;
	value: FileSystemItem;
	map: FileSystemMap;
}
