import { PlayIcon, StopIcon } from "@heroicons/react/24/outline";
import { FC, createElement } from "react";
import { useDispatch } from "react-redux";

import { useAppSelector } from "../../store";
import { useStores } from "../../store/use-stores";
import { SpotifyTrackProvider } from "../spotify-track-provider";
import { ViewItem, WorkItemViewAction } from "./view-item";

export const ViewSpotifyTrackItem: FC<WorkItemViewPreviewProps> = ({
	trackID,
	onContentClick,
	contentButton,
	className,
	imageClassName,
	contentClassName,
	textClassName,
}) => {
	const stores = useStores();
	const dispatch = useDispatch();

	const isPlaying = useAppSelector(state => state.workItems.nowPlaying === trackID);

	const handlePlayClick = () => {
		if (!trackID) return;

		dispatch(stores.workItemsStore.actions.setNowPlaying(trackID));
	};

	const handleStopClick = () => {
		if (!trackID) return;

		dispatch(stores.workItemsStore.actions.clearNowPlaying());
	};

	const handleContentClick = () => {
		if (!trackID) return;

		dispatch(
			stores.workItemsStore.actions.setSelected({
				type: "spotify",
				id: trackID,
			}),
		);
	};

	return (
		<SpotifyTrackProvider trackID={trackID}>
			{track => (
				<ViewItem
					title={track?.name}
					artist={track?.artists.map(artist => artist.name).join(", ")}
					imageURL={track?.album.images[0]?.url}
					isLoading={track === null}
					onContentClick={onContentClick ?? handleContentClick}
					className={className}
					imageClassName={imageClassName}
					contentClassName={contentClassName}
					textClassName={textClassName}
					imageButton={
						track
							? {
									title: `Play ${track.name}`,
									icon: iconClassName =>
										isPlaying ? <StopIcon className={iconClassName} /> : <PlayIcon className={iconClassName} />,
									onClick: isPlaying ? handleStopClick : handlePlayClick,
								}
							: null
					}
					contentButton={contentButton}
				/>
			)}
		</SpotifyTrackProvider>
	);
};

export interface WorkItemViewPreviewProps {
	trackID: string | null;
	onContentClick?: () => void;
	contentButton?: WorkItemViewAction | null;
	className?: string;
	imageClassName?: string;
	contentClassName?: string;
	textClassName?: string;
}
