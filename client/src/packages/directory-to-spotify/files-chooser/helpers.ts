import {
	ExecuteDirectoryReadOptions,
	FileSystemItemConfigurationFunction,
	FileSystemItemIgnoreFunction,
	executeDirectoryRead,
} from "packages/file-system-read-recursively";

import { FileSystemConfiguration } from "../types";

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const IGNORED_DIRECTORIES = new Set([".git", "node_modules", ".vscode", ".idea", ".vs", ".github"]);

const ignoreFunction: FileSystemItemIgnoreFunction<FileSystemConfiguration> = ({ handle }) => {
	if (handle.kind === "directory") {
		return IGNORED_DIRECTORIES.has(handle.name);
	} else {
		return true;
	}
};

const configurationFunction: FileSystemItemConfigurationFunction<FileSystemConfiguration> = ({ file }) => ({
	skip: file ? file.type !== "audio/mpeg" || file.size > MAX_FILE_SIZE : false,
	isExpanded: false,
});

const options: ExecuteDirectoryReadOptions<FileSystemConfiguration> = {
	ignoreFunction,
	configurationFunction,
};

export const executeDirectoryReadCustom = () => executeDirectoryRead(options);
