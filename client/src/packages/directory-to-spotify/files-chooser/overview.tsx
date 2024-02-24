import { FC, Fragment } from "react";

export const FilesChooserOverview: FC<FilesChooserOverviewProps> = ({ selected, sizeFormatted }) => (
	<div>
		{selected} audio files selected
		<Fragment> </Fragment>
		<span className="text-gray-500">{sizeFormatted}</span>
	</div>
);

export interface FilesChooserOverviewProps {
	selected: number | null;
	sizeFormatted: string | null;
}
