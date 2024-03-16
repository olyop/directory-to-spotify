import { FC, ReactNode, useEffect, useState } from "react";
import { Track } from "spotify-types";

import { useSpotify } from "../../packages/spotify-web-api-react";

export const SpotifyTrackProvider: FC<WorkItemViewPreviewProps> = ({ trackID, children }) => {
	const { client } = useSpotify();

	const [track, setTrack] = useState<Track | null>(null);

	const handlePopulateSpotifyTrack = async () => {
		const value = await client.query<Track>("GET", `tracks/${trackID}`, {
			cache: true,
		});

		setTrack(value);
	};

	useEffect(() => {
		if (trackID === null) return;

		void handlePopulateSpotifyTrack();

		// eslint-disable-next-line consistent-return
		return () => {
			setTrack(null);
		};
	}, [trackID]);

	return children(track);
};

export interface WorkItemViewPreviewProps {
	trackID: string | null;
	children: (track: Track | null) => ReactNode;
}
