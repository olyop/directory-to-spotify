// eslint-disable-next-line unicorn/prevent-abbreviations
import { IndexedDbCacheProvider, LocalStorageProvider, SpotifyWebApiClient } from "../../packages/spotify-web-api";

export const spotify = new SpotifyWebApiClient({
	clientId: import.meta.env.VITE_SPOTIFY_CLIENT_ID,
	redirectUri: window.location.origin,
	storageProvider: new LocalStorageProvider(),
	cacheProvider: new IndexedDbCacheProvider(),
	scope: [
		"user-read-private",
		"user-read-email",
		"user-read-playback-state",
		"user-read-currently-playing",
		"user-read-recently-played",
		"user-read-playback-position",
		"user-read-playback-state",
		"user-read-currently-playing",
		"user-read-recently-played",
		"user-modify-playback-state",
		"user-library-read",
		"user-library-modify",
		"user-follow-read",
		"user-follow-modify",
		"user-top-read",
		"streaming",
		"app-remote-control",
	].join(" "),
});
