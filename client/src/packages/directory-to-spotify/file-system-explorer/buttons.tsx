import CheckCircleIcon from "@heroicons/react/20/solid/CheckCircleIcon";
import ChevronDownIcon from "@heroicons/react/20/solid/ChevronDownIcon";
import ChevronRightIcon from "@heroicons/react/20/solid/ChevronRightIcon";
import MusicalNoteIcon from "@heroicons/react/20/solid/MusicalNoteIcon";
import { Button } from "components/button";
import { FC, Fragment } from "react";

import { FileSystemExplorerItemExpandButtonProps, FileSystemExplorerItemSkipButtonProps } from "./props";

export const FileSystemExplorerItemExpandButton: FC<FileSystemExplorerItemExpandButtonProps> = ({
	path,
	skip,
	isExpanded,
	onExpand,
	fileSystemItem,
	selected,
	sizeFormatted,
}) => {
	const iconClassName = `w-4 h-4 ${skip ? "text-gray-500" : ""}`;

	return (
		<button title={path} onClick={onExpand} className="flex gap-2 items-center py-2 px-4 hover:bg-slate-700 rounded-lg">
			{fileSystemItem.children === null ? (
				<MusicalNoteIcon className={iconClassName} />
			) : skip ? (
				<ChevronRightIcon className={iconClassName} />
			) : isExpanded ? (
				<ChevronDownIcon className={iconClassName} />
			) : (
				<ChevronRightIcon className={iconClassName} />
			)}
			<div className={`select-none flex items-center gap-4 ${skip || selected === 0 ? "text-gray-500" : ""}`}>
				<span className="text-2xl">
					{fileSystemItem.handle.name}
					{fileSystemItem.children !== null && (
						<span className="text-gray-500">
							<Fragment> (</Fragment>
							{selected}
							<Fragment>)</Fragment>
						</span>
					)}
				</span>
				<span className="text-sm">
					<Fragment> </Fragment>
					<span className="text-gray-500">{sizeFormatted}</span>
				</span>
			</div>
		</button>
	);
};

export const FileSystemExplorerItemSkipButton: FC<FileSystemExplorerItemSkipButtonProps> = ({
	path,
	skip,
	onSkip,
	selected,
	sizeFormatted,
}) => (
	<Button
		transparent
		onClick={onSkip}
		className="!rounded-full"
		ariaLabel={`Skip - ${selected} - ${sizeFormatted} - ${path}`}
		leftIcon={classNameIcon => (
			<CheckCircleIcon
				className={`${classNameIcon} w-4 h-4 ${skip || selected === 0 ? "text-gray-500" : "text-white"}`}
			/>
		)}
	/>
);
