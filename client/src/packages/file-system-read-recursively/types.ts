export interface FileSystemItemConfigurationOptions<Configuration = null> {
	configuration: Configuration;
}

export interface FileSystemItemFunctionBaseOptions {
	isRoot: boolean;
	file: File | null;
	handle: FileSystemHandle;
}

export interface FileSystemItemIgnoreFunctionOptions<Configuration = null>
	extends FileSystemItemFunctionBaseOptions,
		FileSystemItemConfigurationOptions<Configuration> {}

export type FileSystemItemIgnoreFunction<Configuration = null> = (
	options: FileSystemItemIgnoreFunctionOptions<Configuration>,
) => boolean;

export type FileSystemItemConfigurationFunction<T> = (options: FileSystemItemFunctionBaseOptions) => T;

export interface ExecuteDirectoryReadOptions<Configuration = null> {
	ignoreFunction?: FileSystemItemIgnoreFunction<Configuration>;
	configurationFunction?: FileSystemItemConfigurationFunction<Configuration>;
}

export type FileSystemItemChildren<Configuration = null> = FileSystemItem<Configuration>[] | null;

export interface FileSystemItemPathOptions {
	path: string;
}

export interface FileSystemItemSizeOptions {
	size: number | null;
}

export interface FileSystemItemChildrenOptions<Configuration = null> {
	children: FileSystemItemChildren<Configuration>;
}

export interface FileSystemItemBaseOptions<Configuration = null>
	extends FileSystemItemPathOptions,
		FileSystemItemSizeOptions,
		FileSystemItemConfigurationOptions<Configuration> {
	handle: FileSystemHandle;
}

export interface FileSystemItem<Configuration = null>
	extends FileSystemItemBaseOptions<Configuration>,
		FileSystemItemChildrenOptions<Configuration> {}
