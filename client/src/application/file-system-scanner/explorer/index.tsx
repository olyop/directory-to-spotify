import ChevronDoubleRightIcon from "@heroicons/react/24/outline/ChevronDoubleRightIcon";
import XMarkIcon from "@heroicons/react/24/outline/XMarkIcon";
import { FC, Fragment, createElement, useState } from "react";

import { Button } from "../../../components/button";
import { Page } from "../../../components/page";
import { calculateFileSystemReadCount } from "../../../packages/file-system-read";
import { FileSystemReadExplorer } from "../../../packages/file-system-read-explorer";
import { ClassNameProps } from "../../../props";
import { FileSystemReadDirectoryCustom } from "../../types";

export const FileSystemExplorer: FC<FileSystemScannerExplorerProps> = ({ fileSystem, onCancel, onScanStart }) => {
	const [count, setCount] = useState<number | null>(calculateFileSystemReadCount(fileSystem));

	const handleCountChange = (newCount: number | null) => {
		setCount(newCount);
	};

	return (
		<Page
			contentNode={<FileSystemReadExplorer fileSystemItem={fileSystem} onCountChange={handleCountChange} />}
			controlsNode={
				<Fragment>
					<Button
						transparent
						text="Cancel"
						ariaLabel="Cancel"
						onClick={onCancel}
						leftIcon={className => <XMarkIcon className={className} />}
					/>
					<Button
						text="Scan"
						disabled={count === 0}
						ariaLabel="Start scan"
						onClick={onScanStart}
						rightIcon={className => <ChevronDoubleRightIcon className={className} />}
					/>
				</Fragment>
			}
		/>
	);
};

export interface FileSystemScannerExplorerProps extends ClassNameProps {
	fileSystem: FileSystemReadDirectoryCustom;
	onCancel: () => void;
	onScanStart: () => void;
}
