import CheckCircleIcon from "@heroicons/react/20/solid/CheckCircleIcon";
import ChevronDownIcon from "@heroicons/react/20/solid/ChevronDownIcon";
import ChevronRightIcon from "@heroicons/react/20/solid/ChevronRightIcon";
import MusicalNoteIcon from "@heroicons/react/20/solid/MusicalNoteIcon";
import { Button } from "components/button";
import { convertSetToArray } from "helpers/convert-set-to-array";
import { FC, Fragment, PropsWithChildren, ReactNode, useState } from "react";
import { FileSystemItem, FileSystemItemOptions, FileSystemSet } from "utilities/read-directory";

import { determineFileSystemSelected } from "./helpers";

const FileSystemExplorerContainer: FC<PropsWithChildren<FileSystemExplorerBaseProps>> = ({ className, children }) => (
	<div className={`flex flex-col gap-1 ${className ?? ""}`}>{children}</div>
);

const FileSystemExplorerItemIcon: FC<FileSystemExplorerItemIconProps> = ({ skip, isExpanded, hasChildren }) =>
	hasChildren ? (
		skip ? (
			<ChevronRightIcon className="w-4 h-4 text-gray-500" />
		) : isExpanded ? (
			<ChevronDownIcon className="w-4 h-4" />
		) : (
			<ChevronRightIcon className="w-4 h-4" />
		)
	) : (
		<MusicalNoteIcon className="w-4 h-4" />
	);

const FileSystemExplorerItem = ({
	fileSystemItem,
	renderChildFileSystem,
	className,
	onUpdate,
}: FileSystemExplorerItemProps) => {
	const item = fileSystemItem;

	const { path, handle, children, skip, isExpanded: isExpandedInput } = item;

	const [isExpanded, setIsExpanded] = useState(isExpandedInput);

	const handleDirectoryClick = () => {
		setIsExpanded(prevState => {
			const newState = !prevState;

			item.isExpanded = newState;

			return newState;
		});
	};

	const handleSkipClick = () => {
		item.skip = !skip;

		onUpdate();
	};

	const hasChildren = children !== null;

	const itemNode = (
		<Fragment>
			{handle.name}
			{hasChildren && (
				<Fragment>
					<Fragment> </Fragment>
					<span className="text-gray-500">
						<Fragment>(</Fragment>
						{determineFileSystemSelected(fileSystemItem)}
						<Fragment>)</Fragment>
					</span>
				</Fragment>
			)}
		</Fragment>
	);

	return (
		<FileSystemExplorerContainer className={className}>
			<div className="flex items-center gap-1 pr-4">
				<button
					title={path}
					onClick={hasChildren ? handleDirectoryClick : undefined}
					className="flex gap-2 items-center py-2 px-4 hover:bg-slate-700 rounded-lg"
				>
					<FileSystemExplorerItemIcon skip={skip} isExpanded={isExpanded} hasChildren={hasChildren} />
					<p className={`select-none ${skip ? "text-gray-500" : ""}`}>{skip ? <s>{itemNode}</s> : itemNode}</p>
				</button>
				<Button
					transparent
					ariaLabel={`Skip - ${path}`}
					onClick={handleSkipClick}
					className="!rounded-full"
					leftIcon={classNameIcon => (
						<CheckCircleIcon className={`${classNameIcon} w-4 h-4 ${skip ? "text-gray-500" : "text-white"}`} />
					)}
				/>
			</div>
			{hasChildren && isExpanded && !skip && renderChildFileSystem(children)}
		</FileSystemExplorerContainer>
	);
};

export const FileSystemExplorer: FC<FileSystemExplorerProps> = ({
	fileSystem,
	fileSystemParent = fileSystem,
	className,
	onUpdate,
}) => (
	<FileSystemExplorerContainer className={className}>
		{convertSetToArray(fileSystem).map(fileSystemItem => (
			<FileSystemExplorerItem
				key={fileSystemItem.path}
				fileSystemItem={fileSystemItem}
				onUpdate={onUpdate}
				renderChildFileSystem={childFileSystem => (
					<FileSystemExplorer
						fileSystemParent={fileSystemParent}
						fileSystem={childFileSystem}
						className="pl-5"
						onUpdate={onUpdate}
					/>
				)}
			/>
		))}
	</FileSystemExplorerContainer>
);

interface FileSystemExplorerBaseProps {
	className?: string | undefined;
}

interface FileSystemExplorerItemIconProps extends FileSystemItemOptions {
	hasChildren: boolean;
}

interface FileSystemExplorerRecursiveBaseProps {
	onUpdate: () => void;
}

interface FileSystemExplorerItemProps extends FileSystemExplorerBaseProps, FileSystemExplorerRecursiveBaseProps {
	fileSystemItem: FileSystemItem;
	renderChildFileSystem: (childFileSystem: FileSystemSet) => ReactNode;
}

export interface FileSystemExplorerProps extends FileSystemExplorerBaseProps, FileSystemExplorerRecursiveBaseProps {
	fileSystem: FileSystemSet;
	fileSystemParent?: FileSystemSet;
}
