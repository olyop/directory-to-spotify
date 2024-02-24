import { FileSystemItemPathOptions } from "packages/file-system-read-recursively";
import { ReactNode } from "react";

import { FileSystemConfiguration, FileSystemItemCustom } from "../types";
import { FileSystemExplorerOnSkipUpdate } from "./types";

export interface FileSystemExplorerClassNameProps {
	className?: string | undefined;
}

interface FileSystemExplorerItemPropProps {
	fileSystemItem: FileSystemItemCustom;
}

interface FileSystemExplorerOnUpdateProps {
	onSkipUpdate: FileSystemExplorerOnSkipUpdate;
}

export interface FileSystemExplorerContainerProps extends FileSystemExplorerClassNameProps {}

export interface FileSystemExplorerSelectedProps {
	selected: number;
}

export interface FileSystemExplorerSkipProps {
	skip: boolean;
}

export interface FileSystemExplorerIsExpandedProps {
	isExpanded: boolean;
}

export interface FileSystemExplorerSizeProps {
	sizeFormatted: string;
}

interface FileSystemExplorerConfigurationProps extends FileSystemItemPathOptions, FileSystemExplorerSelectedProps {
	configuration: FileSystemConfiguration;
}

export interface FileSystemExplorerItemExpandButtonProps
	extends FileSystemExplorerConfigurationProps,
		FileSystemExplorerItemPropProps,
		FileSystemExplorerSizeProps {
	onExpand: () => void;
}

export interface FileSystemExplorerItemSkipButtonProps
	extends FileSystemExplorerConfigurationProps,
		FileSystemExplorerSizeProps {
	onSkip: () => void;
}

export interface FileSystemExplorerItemProps
	extends FileSystemExplorerClassNameProps,
		FileSystemExplorerItemPropProps,
		FileSystemExplorerOnUpdateProps {
	fileSystemParent: FileSystemItemCustom;
	renderChildren: (props: FileSystemExplorerInternalProps) => ReactNode;
}

export interface FileSystemExplorerFileSystemProps {
	fileSystem: FileSystemItemCustom[];
}

export interface FileSystemExplorerBaseProps
	extends FileSystemExplorerFileSystemProps,
		FileSystemExplorerOnUpdateProps,
		FileSystemExplorerClassNameProps {}

export interface FileSystemExplorerInternalProps
	extends FileSystemExplorerBaseProps,
		FileSystemExplorerConfigurationProps {}

export interface FileSystemExplorerProps extends FileSystemExplorerBaseProps {}
