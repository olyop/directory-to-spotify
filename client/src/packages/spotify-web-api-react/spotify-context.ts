import { createContext } from "react";

import { SpotifyContext as SpotifyContextType, SpotifyInternalOptions, SpotifyUser } from "./types";

export const SpotifyContext = createContext<SpotifyContextType>({
	isAuthenticated: null,
	options: {} as SpotifyInternalOptions,
	spotifyLogin: () => {},
	spotifyLogout: () => {},
	user: {} as SpotifyUser,
});
