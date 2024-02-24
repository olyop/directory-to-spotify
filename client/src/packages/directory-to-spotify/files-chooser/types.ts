import { FileSystemState } from "../types";

export type FilesChooserOnChooseProp = (fileSystem: FileSystemState) => void;

export interface FilesChooserProps {
	fileSystem: FileSystemState;
	onChoose: FilesChooserOnChooseProp;
}
