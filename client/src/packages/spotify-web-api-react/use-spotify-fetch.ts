import { useContext } from "react";

import { SpotifyContext } from "./spotify-context";
import { spotifyRequest } from "./utilities";

export const useSpotifyFetch = () => {
	const { options } = useContext(SpotifyContext);

	return spotifyRequest(options);
};
