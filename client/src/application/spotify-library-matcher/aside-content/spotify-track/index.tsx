import { ArrowTopRightOnSquareIcon, PlayIcon } from "@heroicons/react/24/outline";
import { FC, Fragment, createElement } from "react";

import { Button } from "../../../../components/button";
import { useAppDispatch } from "../../../store";
import { useStores } from "../../../store/use-stores";
import { SpotifyTrackProvider } from "../../spotify-track-provider";
import { TrackContent } from "../track-content";

export const AsideSpotifyTrackContent: FC<AsideSpotifyTrackContentProps> = ({ trackID }) => {
	const stores = useStores();
	const dispatch = useAppDispatch();

	const handlePlaySong = () => {
		if (!trackID) return;

		dispatch(stores.workItemsStore.actions.setNowPlaying(trackID));
	};

	return (
		<SpotifyTrackProvider trackID={trackID}>
			{track => (
				<TrackContent
					image={track?.album.images[0]?.url ?? ""}
					title={track?.name ?? ""}
					artist={track ? track.artists.reduce((content, artist) => `${content}, ${artist.name}`, "").slice(2) : ""}
					album={track?.album.name ?? ""}
					albumArtist={
						track ? track.album.artists.reduce((content, artist) => `${content}, ${artist.name}`, "").slice(2) : ""
					}
					year={track?.album.release_date ?? ""}
					buttons={
						<Fragment>
							<Button
								transparent
								text="Play"
								ariaLabel="Play on Spotify"
								leftIcon={className => <PlayIcon className={className} />}
								onClick={handlePlaySong}
							/>
							<a href={track?.external_urls.spotify} target="_blank" rel="noreferrer">
								<Button
									transparent
									text="Open"
									ariaLabel="Open in Spotify"
									leftIcon={className => <ArrowTopRightOnSquareIcon className={className} />}
								/>
							</a>
						</Fragment>
					}
				/>
			)}
		</SpotifyTrackProvider>
	);
};
export interface AsideSpotifyTrackContentProps {
	trackID: string | null;
}
