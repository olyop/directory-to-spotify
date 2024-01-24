import { FileSystemMap } from "layouts/directory-chooser/types";
import { FC } from "react";

import { FileSystemExplorerDirectory } from "./directory";
import { convertFileSystemToArray } from "./helpers";
import { FileSystemExplorerBaseProps } from "./types";

export const FileSystemExplorerWrapper: FC<FileSystemExplorerWrapperProps> = ({
	fileSystem,
	fileSystemRoot = fileSystem,
	className,
	onUpdateFileSystem,
}) => {
	const fileSystemArray = convertFileSystemToArray(fileSystem);
	return (
		<FileSystemExplorerDirectory
			fileSystemRoot={fileSystemRoot}
			fileSystemArray={fileSystemArray}
			className={className}
			onUpdateFileSystem={onUpdateFileSystem}
		/>
	);
};

export interface FileSystemExplorerWrapperProps extends FileSystemExplorerBaseProps {
	fileSystem: FileSystemMap;
	fileSystemRoot?: FileSystemMap;
}
