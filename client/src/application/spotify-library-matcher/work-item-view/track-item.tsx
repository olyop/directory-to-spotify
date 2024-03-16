import { FC, createElement } from "react";

import { useAppDispatch } from "../../store";
import { useStores } from "../../store/use-stores";
import { SpotifyTrackProvider } from "../spotify-track-provider";
import { WorkItemViewItem } from "./item";

export const WorkItemViewTrackItem: FC<WorkItemViewPreviewProps> = ({
	trackID,
	showAlbumForTitle,
	onClick,
	className,
	contentClassName,
}) => {
	const stores = useStores();
	const dispatch = useAppDispatch();

	const handlePlayToggle = () => {
		if (!trackID) return;

		dispatch(stores.workItemsStore.actions.setNowPlaying(trackID));
	};

	return (
		<SpotifyTrackProvider trackID={trackID}>
			{track => (
				<WorkItemViewItem
					onClick={onClick}
					className={className}
					isLoading={track === null}
					title={track?.name ?? null}
					onPlayToggle={handlePlayToggle}
					album={track?.album.name ?? null}
					contentClassName={contentClassName}
					showAlbumForTitle={showAlbumForTitle}
					imageURL={track?.album.images[0]?.url ?? null}
					artist={track ? track.artists.reduce((content, artist) => `${content}, ${artist.name}`, "").slice(2) : ""}
				/>
			)}
		</SpotifyTrackProvider>
	);
};

export interface WorkItemViewPreviewProps {
	trackID: string | null;
	showAlbumForTitle?: boolean;
	onClick?: (() => void) | undefined;
	className?: string;
	contentClassName?: string;
}
