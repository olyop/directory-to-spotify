import { Button } from "components/button";
import { FileSystemExplorer } from "components/file-system-explorer";
import { FileSystemExplorerOnUpdateFileSystem } from "components/file-system-explorer/types";
import { FC, useState } from "react";

import { executeDirectoryRead } from "./helpers";
import { FileSystemMap } from "./types";

export const DirectoryChooser: FC = () => {
	const [fileSystem, setFileSystem] = useState<FileSystemMap | null>(null);

	const test = async () => {
		setFileSystem(await executeDirectoryRead());
	};

	const handleDirectoryChoose = () => {
		void test();
	};

	const updateFileSystem: FileSystemExplorerOnUpdateFileSystem = (fileSystemRoot, fileSystemMap, key) => {
		const fileSystemItem = fileSystemMap.get(key);

		// tranverse fileSystemRoot to fileSystemItemn
		for (const fileSystemRootItem of fileSystemRoot) {
			const fileSystemItemKey = fileSystemRootItem[0];
			const fileSystemItemValue = fileSystemRootItem[1];

			const fileSystemItemValueFileSystem = fileSystemItemValue.fileSystem;

			if (fileSystemItemValueFileSystem instanceof Map) {
				if (fileSystemItemKey === key && fileSystemItem !== undefined && fileSystemItemValue === fileSystemItem) {
					const previousIsExpanded = fileSystemItemValue.isExpanded;
					fileSystemItemValue.isExpanded = !previousIsExpanded;
				} else {
					updateFileSystem(fileSystemMap, fileSystemItemValueFileSystem, key);
				}
			}
		}
	};

	const handleUpdateFileSystem: FileSystemExplorerOnUpdateFileSystem = (fileSystemRoot, fileSystemMap, key) => {
		updateFileSystem(fileSystemRoot, fileSystemMap, key);

		setFileSystem(fileSystemRoot);
	};

	return (
		<div className="w-full h-full flex items-center justify-center p-8">
			{fileSystem === null && <Button text="Choose" ariaLabel="Choose" onClick={handleDirectoryChoose} />}
			{fileSystem && (
				<div className="p-4 border rounded w-full h-full overflow-y-scroll">
					<FileSystemExplorer fileSystem={fileSystem} onUpdateFileSystem={handleUpdateFileSystem} />
				</div>
			)}
		</div>
	);
};
