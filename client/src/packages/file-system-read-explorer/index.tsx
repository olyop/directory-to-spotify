import CheckCircleOutlineIcon from "@heroicons/react/24/outline/CheckCircleIcon";
import CheckCircleSolidIcon from "@heroicons/react/24/outline/CheckCircleIcon";
import ChevronDownIcon from "@heroicons/react/24/outline/ChevronDownIcon";
import ChevronRightIcon from "@heroicons/react/24/outline/ChevronRightIcon";
import MusicalNoteIcon from "@heroicons/react/24/outline/MusicalNoteIcon";
import { Fragment, createElement, memo, useEffect, useState } from "react";

import { Button } from "../../components/button";
import { useHasMounted } from "../../hooks/use-has-mounted";
import { ClassNameProps } from "../../props";
import { FileSystemReadItem, calculateFileSystemReadCount } from "../file-system-read";

// eslint-disable-next-line @typescript-eslint/comma-dangle
export const FileSystemReadExplorer = memo<FileSystemReadExplorerProps<unknown>>(
	({ fileSystemItem, isParentSelected = true, onCountChange, className }) => {
		const hasMounted = useHasMounted();

		const isDirectory = "children" in fileSystemItem && "isOpen" in fileSystemItem;
		const openInitial = isDirectory ? fileSystemItem.isOpen : false;
		const isSelectedInitial = fileSystemItem.isSelected;
		const countInitial = isDirectory ? calculateFileSystemReadCount(fileSystemItem) : null;

		const [isOpen, setIsOpen] = useState(openInitial);
		const [isSelected, setIsSelected] = useState(isSelectedInitial);
		const [count, setCount] = useState<number | null>(countInitial);

		const handleOpenToggle = () => {
			setIsOpen(prevState => !prevState);
		};

		const handleSelectToggle = () => {
			setIsSelected(prevState => {
				const value = !prevState;

				// eslint-disable-next-line no-param-reassign
				fileSystemItem.isSelected = value;

				return value;
			});
		};

		const handleSelectedUpdate = () => {
			const countValue = isDirectory ? calculateFileSystemReadCount(fileSystemItem) : null;

			setCount(countValue);

			if (onCountChange) {
				onCountChange(countValue);
			}
		};

		useEffect(() => {
			if (hasMounted && isParentSelected) {
				setIsSelected(isParentSelected);
			}
		}, [isParentSelected]);

		useEffect(() => {
			if (hasMounted) {
				handleSelectedUpdate();
			}
		}, [isSelected]);

		const isSelectedCalculated = isParentSelected && isSelected;

		return (
			<div className={`flex flex-col items-start ${isSelected ? "" : "text-gray-500"} ${className}`}>
				<div className="flex items-center justify-start gap-2">
					<Button
						transparent
						className="gap-4 border-0"
						textClassName="normal-case"
						onClick={handleOpenToggle}
						text={
							<Fragment>
								<span>{fileSystemItem.handle.name}</span>
								{isDirectory && isParentSelected && (
									<Fragment>
										<Fragment> </Fragment>
										<span className="text-gray-500">({count})</span>
									</Fragment>
								)}
							</Fragment>
						}
						ariaLabel={isOpen ? "Collapse folder" : "Expand folder"}
						leftIcon={() =>
							isDirectory ? (
								isOpen ? (
									<ChevronRightIcon className="size-5" />
								) : (
									<ChevronDownIcon className="size-5" />
								)
							) : (
								<MusicalNoteIcon className="size-5" />
							)
						}
					/>
					{isParentSelected && (
						<Button
							transparent
							ariaLabel="Select"
							disabled={!isParentSelected}
							onClick={handleSelectToggle}
							className="border-0 disabled:cursor-not-allowed disabled:bg-transparent"
							leftIcon={() =>
								isSelected ? <CheckCircleSolidIcon className="size-5" /> : <CheckCircleOutlineIcon className="size-5" />
							}
						/>
					)}
				</div>
				{isDirectory && isOpen && fileSystemItem.children && (
					<div className="flex flex-col">
						{fileSystemItem.children.map(child => (
							<FileSystemReadExplorer
								key={child.path}
								className="pl-8"
								fileSystemItem={child}
								isParentSelected={isSelectedCalculated}
								onCountChange={handleSelectedUpdate}
							/>
						))}
					</div>
				)}
			</div>
		);
	},
);

export interface FileSystemReadExplorerProps<Properties> extends ClassNameProps {
	fileSystemItem: FileSystemReadItem<Properties>;
	isParentSelected?: boolean;
	onCountChange?: ((count: number | null) => void) | undefined;
}
