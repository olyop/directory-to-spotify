import { FC, useEffect, useState } from "react";

import { ControlBar } from "./control-bar";
import { FileSystemScanner } from "./file-system-scanner";
import { FilesChooser, FilesChooserOnChooseProp } from "./files-chooser";
import { FileSystemState } from "./types";

export const DirectoryToSpotify: FC = () => {
	const [isMain, setIsMain] = useState(false);
	const [hasChosenDirectory, setHasChosenDirectory] = useState(false);
	const [fileSystem, setFileSystem] = useState<FileSystemState>(null);

	const handleSetMain = () => {
		setIsMain(true);
	};

	const handleCancel = () => {
		setIsMain(false);
		setFileSystem(null);
		setHasChosenDirectory(false);
	};

	const handleFileSystemChoose: FilesChooserOnChooseProp = newFileSystem => {
		setFileSystem(newFileSystem);
	};

	useEffect(() => {
		if (fileSystem !== null && !(fileSystem instanceof Error)) {
			setHasChosenDirectory(true);
		}
	}, [fileSystem]);

	return (
		<div>
			<div className="w-full h-content-height flex flex-col justify-between">
				{isMain && fileSystem instanceof Set ? (
					<FileSystemScanner fileSystem={fileSystem} />
				) : (
					<FilesChooser fileSystem={fileSystem} onChoose={handleFileSystemChoose} />
				)}
			</div>
			<ControlBar
				isMain={isMain}
				hasChosenDirectory={hasChosenDirectory}
				onSetMain={handleSetMain}
				onCancel={handleCancel}
			/>
		</div>
	);
};
