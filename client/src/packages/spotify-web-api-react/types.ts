import { SpotifyWebApiClient, SpotifyWebApiClientLogInOut, SpotifyWebApiClientState } from "../spotify-web-api";

export interface SpotifyWebApiReactOptions {
	defaultProfileImagePath: string;
}

export interface SpotifyUser extends Record<string, string> {
	id: string;
	name: string;
	photoUrl: string;
	spotifyUrl: string;
	emailAddress: string;
}

export type SpotifyWebApiReactContextUser = SpotifyUser | null;

export interface SpotifyContext extends SpotifyWebApiClientState, SpotifyWebApiClientLogInOut {
	isLoading: boolean;
	client: SpotifyWebApiClient;
	user: SpotifyWebApiReactContextUser;
}

export interface SpotifyReactProviderProps {
	client: SpotifyWebApiClient;
	options?: SpotifyWebApiReactOptions;
}
