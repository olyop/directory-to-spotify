import { FC, Fragment, ReactNode, createElement } from "react";

import { DataItem } from "./data-item";

export const TrackContent: FC<TrackContentProps> = ({
	image,
	title,
	artist,
	album,
	albumArtist,
	year,
	path,
	buttons,
}) => (
	<Fragment>
		{image ? (
			<img src={image} className="aspect-square w-full rounded-2xl bg-black" alt={title} title={title} />
		) : (
			<div className="aspect-square h-auto w-full rounded-2xl bg-black" />
		)}
		<div className="flex size-full flex-col gap-2">
			<div className="flex flex-col">
				<h1 className="truncate text-2xl" title={title}>
					{title}
				</h1>
				<p className="text truncate" title={title}>
					{artist}
				</p>
			</div>
			<DataItem label="Album" value={album} />
			<DataItem label="Album Artist" value={albumArtist} />
			<DataItem label="Year" value={year} />
			{path && <DataItem label="Path" value={path} />}
		</div>
		<div className="flex w-full items-center gap-4">{buttons}</div>
	</Fragment>
);

export interface TrackContentProps {
	image: string | null;
	title: string;
	artist: string;
	album: string | null;
	albumArtist: string | null;
	year: string | null;
	path?: string;
	buttons: ReactNode;
}
