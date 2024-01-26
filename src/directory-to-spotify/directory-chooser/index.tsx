import { Button } from "components/button";
import { FileSystemExplorer } from "components/file-system-explorer";
import { determineFileSystemSelected } from "components/file-system-explorer/helpers";
import { FileSystemState } from "directory-to-spotify/types";
import { getFirstItemOfSet } from "helpers/get-first-item-of-set";
import { Dispatch, FC, SetStateAction } from "react";
import { executeDirectoryRead } from "utilities/read-directory";

export const DirectoryChooser: FC<DirectoryChooserProps> = ({ fileSystem, onUpdate }) => {
	const directoryRead = async () => {
		let state: FileSystemState;

		try {
			state = await executeDirectoryRead();
		} catch (error) {
			state = error instanceof Error ? error : new Error("Unknown error");
		}

		onUpdate(state);
	};

	const handleDirectoryChoose = () => {
		void directoryRead();
	};

	const handleFileSystemUpdate = () => {
		onUpdate(prevState => {
			if (prevState instanceof Set) {
				return new Set(prevState);
			} else {
				return prevState;
			}
		});
	};

	return (
		<div className="w-full h-full flex items-center justify-center p-8">
			{fileSystem ? (
				fileSystem instanceof Error ? (
					<p>Error: {fileSystem.message}</p>
				) : (
					<div className="flex w-full h-full flex-col gap-6">
						<FileSystemExplorer
							fileSystem={fileSystem}
							className="p-4 border rounded w-full h-full overflow-y-scroll"
							onUpdate={handleFileSystemUpdate}
						/>
						<div>{determineFileSystemSelected(getFirstItemOfSet(fileSystem))} mp3 files selected</div>
					</div>
				)
			) : (
				<Button ariaLabel="Choose" onClick={handleDirectoryChoose} text="Choose" />
			)}
		</div>
	);
};

export type DirectoryChooserOnChooseProp = (fileSystem: FileSystemState) => void;

export interface DirectoryChooserProps {
	fileSystem: FileSystemState;
	onUpdate: Dispatch<SetStateAction<FileSystemState>>;
}
