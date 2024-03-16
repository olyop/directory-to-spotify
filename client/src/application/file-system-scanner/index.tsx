import { FC, createElement, useEffect, useState } from "react";

import { FileSystemReadDirectoryCustom } from "../types";
import { DirectoryChooser } from "./directory-chooser";
import { FileSystemExplorer } from "./explorer";
import { FileSystemScanning } from "./scanning";

export const FileSystemScanner: FC<FileSystemScannerProps> = ({ onScanComplete }) => {
	const [fileSystem, setFileSystem] = useState<FileSystemReadDirectoryCustom | null>(null);
	const [isExplorer, setIsExplorer] = useState(true);

	const handleDirectoryChoose = (fileSystemValue: FileSystemReadDirectoryCustom) => {
		setFileSystem(fileSystemValue);
	};

	const handleDirectoryCancel = () => {
		setFileSystem(null);
	};

	const handleScanStart = () => {
		setIsExplorer(false);
	};

	const handleScanCancel = () => {
		setIsExplorer(true);
	};

	useEffect(
		() => () => {
			setFileSystem(null);
			setIsExplorer(true);
		},
		[],
	);

	return fileSystem === null ? (
		<DirectoryChooser onChoose={handleDirectoryChoose} />
	) : isExplorer ? (
		<FileSystemExplorer fileSystem={fileSystem} onScanStart={handleScanStart} onCancel={handleDirectoryCancel} />
	) : (
		<FileSystemScanning fileSystem={fileSystem} onScanComplete={onScanComplete} onCancel={handleScanCancel} />
	);
};

export interface FileSystemScannerProps {
	onScanComplete: () => void;
}
