import { DirectoryChooser } from "layouts/directory-chooser";
import { determineFileSystemSize } from "packages/file-system-read-recursively";
import { FC, useState } from "react";

import { FileSystemExplorer, FileSystemExplorerOnSkipUpdate, bytesFormatter } from "../file-system-explorer";
import { determineFileSystemSelected } from "../file-system-explorer/helpers";
import { FileSystemState } from "../types";
import { executeDirectoryReadCustom } from "./helpers";
import { FilesChooserOverview } from "./overview";
import { FilesChooserProps } from "./types";

export * from "./types";

export const FilesChooser: FC<FilesChooserProps> = ({ fileSystem, onChoose }) => {
	const selectedDefaultValue = Array.isArray(fileSystem) ? determineFileSystemSelected(fileSystem[0], false) : 0;

	const [selected, setSelected] = useState<number | null>(0);
	const [sizeFormatted, setSizeFormatted] = useState<string | null>(
		bytesFormatter(determineFileSystemSize(fileSystem)),
	);

	const directoryRead = async () => {
		let state: FileSystemState;

		try {
			state = await executeDirectoryReadCustom();
		} catch (error) {
			if (error instanceof Error) {
				if (error.message === "The user aborted a request.") {
					state = null;
				} else {
					state = error;
				}
			} else {
				state = new Error("Unknown error");
			}
		}

		onChoose(state);
	};

	const handleDirectoryChoose = () => {
		void directoryRead();
	};

	const handleOnSkipUpdate: FileSystemExplorerOnSkipUpdate = (selectedNew, sizeNew) => {
		setSelected(selectedNew);
		setSizeFormatted(bytesFormatter(sizeNew));
	};

	return fileSystem ? (
		fileSystem instanceof Error ? (
			<p>Error: {fileSystem.message}</p>
		) : (
			<div className="flex w-full h-full flex-col gap-6 p-8">
				<h1 className="text-2xl">
					<b>Choose Files</b>
				</h1>
				<FileSystemExplorer
					fileSystem={fileSystem}
					onSkipUpdate={handleOnSkipUpdate}
					className="p-4 border rounded w-full h-full overflow-y-scroll"
				/>
				<FilesChooserOverview selected={selected} size={sizeFormatted} />
			</div>
		)
	) : (
		<DirectoryChooser onClick={handleDirectoryChoose} />
	);
};
