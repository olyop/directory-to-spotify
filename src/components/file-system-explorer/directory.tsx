import CheckCircleIcon from "@heroicons/react/20/solid/CheckCircleIcon";
import ChevronDownIcon from "@heroicons/react/20/solid/ChevronDownIcon";
import ChevronRightIcon from "@heroicons/react/20/solid/ChevronRightIcon";
import MusicalNoteIcon from "@heroicons/react/20/solid/MusicalNoteIcon";
import { FileSystemMap } from "layouts/directory-chooser/types";
import { FC, Fragment, useState } from "react";

import { FileSystemArrayItem, FileSystemExplorerBaseProps } from "./types";
import { FileSystemExplorerWrapper } from "./wrapper";

const FileSystemExplorerDirectoryHandle = ({
	fileSystemRoot,
	fileSystemArrayItem,
	className,
	onUpdateFileSystem,
}: FileSystemExplorerDirectoryHandleProps) => {
	const { key, value, map } = fileSystemArrayItem;
	const { skip: skipInput, isExpanded: isExpandedInput, fileSystem: childFileSystem } = value;

	const [skip, setIsSkip] = useState(skipInput);
	const [isExpanded, setIsFoldersExpanded] = useState(isExpandedInput);

	const handleDirectoryClick = () => {
		onUpdateFileSystem(fileSystemRoot, map, key);

		setIsFoldersExpanded(prevState => !prevState);
	};

	const handleSkipClick = () => {
		setIsSkip(prevState => !prevState);
	};

	const isDirectory = childFileSystem instanceof Map;

	const itemNode = (
		<Fragment>
			{key.split("/").at(-1)}
			{isDirectory ? (
				<span className="text-gray-500">
					<Fragment> (</Fragment>
					{childFileSystem.size}
					<Fragment>)</Fragment>
				</span>
			) : null}
		</Fragment>
	);

	return (
		<div key={key} className={`flex flex-col gap-1 ${className ?? ""}`}>
			<div
				role="button"
				onClick={isDirectory ? handleDirectoryClick : undefined}
				className="flex justify-between items-center py-2 pr-4 hover:bg-slate-700 cursor-pointer rounded-lg"
			>
				<div className="flex gap-2 items-center">
					{isDirectory ? (
						isExpanded ? (
							<ChevronDownIcon className="w-4 h-4" />
						) : (
							<ChevronRightIcon className="w-4 h-4" />
						)
					) : (
						<MusicalNoteIcon className="w-4 h-4" />
					)}
					<p className=" select-none">{skip ? <s>{itemNode}</s> : itemNode}</p>
				</div>
				<CheckCircleIcon className={`w-4 h-4 ${skip ? "text-gray-500" : "text-white"}`} onClick={handleSkipClick} />
			</div>
			{isDirectory && isExpanded && (
				<FileSystemExplorerWrapper
					fileSystemRoot={fileSystemRoot}
					fileSystem={childFileSystem}
					className="pl-5"
					onUpdateFileSystem={onUpdateFileSystem}
				/>
			)}
		</div>
	);
};

interface FileSystemExplorerDirectoryBaseProps extends FileSystemExplorerBaseProps {
	fileSystemRoot: FileSystemMap;
}

interface FileSystemExplorerDirectoryHandleProps extends FileSystemExplorerDirectoryBaseProps {
	fileSystemArrayItem: FileSystemArrayItem;
}

export const FileSystemExplorerDirectory: FC<FileSystemExplorerDirectoryProps> = ({
	fileSystemRoot,
	fileSystemArray,
	className,
	onUpdateFileSystem,
}) => (
	<div className="flex flex-col gap-1">
		{fileSystemArray.map(fileSystemArrayItem => (
			<FileSystemExplorerDirectoryHandle
				key={fileSystemArrayItem.key}
				fileSystemRoot={fileSystemRoot}
				fileSystemArrayItem={fileSystemArrayItem}
				className={className}
				onUpdateFileSystem={onUpdateFileSystem}
			/>
		))}
	</div>
);

interface FileSystemExplorerDirectoryProps extends FileSystemExplorerDirectoryBaseProps {
	fileSystemArray: FileSystemArrayItem[];
}
