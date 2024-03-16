export interface FileSystemReadOptions<Properties>
	extends FileSystemReadPropertiesOptions<Properties>,
		FileSystemReadIgnoreOptions<Properties>,
		FileSystemReadSelectedOptions<Properties>,
		FileSystemReadAbortSignalOptions,
		FileSystemReadOnDirectoryChosenOptions {}

interface FileSystemReadPropertiesOptions<Properties> {
	properties?: FileSystemReadPropertiesFunction<Properties>;
}

interface FileSystemReadIgnoreOptions<Properties> {
	ignore?: FileSystemReadIgnoreFunction<Properties>;
}

interface FileSystemReadSelectedOptions<Properties> {
	selected?: FileSystemReadSelectedFunction<Properties>;
}

interface FileSystemReadAbortSignalOptions {
	signal?: AbortSignal | undefined;
}

interface FileSystemReadOnDirectoryChosenOptions {
	onDirectoryChosen?: FileSystemReadOnDirectoryChosenFunction;
}

export type FileSystemReadPropertiesFunction<Properties> = (options: FileSystemReadFunctionBaseOptions) => Properties;

export type FileSystemReadIgnoreFunction<Properties> = (options: FileSystemReadFunctionOptions<Properties>) => boolean;

export type FileSystemReadOnDirectoryChosenFunction = () => void;

export type FileSystemReadSelectedFunction<Properties> = (
	options: FileSystemReadFunctionOptions<Properties>,
) => boolean;

export interface FileSystemReadFunctionOptions<Properties>
	extends FileSystemReadFunctionBaseOptions,
		FileSystemReadItemProperties<Properties> {}

export interface FileSystemReadFunctionBaseOptions {
	isRoot: boolean;
	file: File | null;
	handle: FileSystemHandle;
}

export type FileSystemReadItem<Properties> = FileSystemReadDirectory<Properties> | FileSystemReadFile<Properties>;

export interface FileSystemReadDirectory<Properties>
	extends FileSystemReadItemBase<FileSystemDirectoryHandle, Properties> {
	isOpen: boolean;
	children: FileSystemReadDirectoryChildren<Properties>;
}

export interface FileSystemReadFile<Properties> extends FileSystemReadItemBase<FileSystemFileHandle, Properties> {}

export interface FileSystemReadItemBase<Handle extends FileSystemHandle, Properties>
	extends FileSystemReadItemHandleOptions<Handle>,
		FileSystemReadItemPathOptions,
		FileSystemReadItemSelectedOptions,
		FileSystemReadItemProperties<Properties> {}

export type FileSystemReadDirectoryChildren<Properties> = FileSystemReadItem<Properties>[] | null;

export interface FileSystemReadItemHandleOptions<Handle extends FileSystemHandle> {
	handle: Handle;
}

export interface FileSystemReadItemPathOptions {
	path: string;
}

export interface FileSystemReadItemSelectedOptions {
	isSelected: boolean;
}

export interface FileSystemReadItemProperties<Properties> {
	properties: Properties;
}
