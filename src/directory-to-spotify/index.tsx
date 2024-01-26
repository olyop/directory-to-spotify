import { ControlBar } from "directory-to-spotify/control-bar";
import { DirectoryChooser } from "directory-to-spotify/directory-chooser";
import { FC, Fragment, useEffect, useState } from "react";

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

	useEffect(() => {
		if (fileSystem !== null && !(fileSystem instanceof Error)) {
			setHasChosenDirectory(true);
		}
	}, [fileSystem]);

	return (
		<Fragment>
			<div className="w-full h-content-height flex flex-col justify-between">
				{isMain ? null : <DirectoryChooser fileSystem={fileSystem} onUpdate={setFileSystem} />}
			</div>
			<ControlBar
				isMain={isMain}
				hasChosenDirectory={hasChosenDirectory}
				onSetMain={handleSetMain}
				onCancel={handleCancel}
			/>
		</Fragment>
	);
};
