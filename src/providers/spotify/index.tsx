import { FC, PropsWithChildren } from "react";
import { SpotifyProvider as SpotifyProviderInternal } from "spotify-web-api-react";

const SPOTIFY_SCOPES = [
	"user-read-private",
	"user-read-email",
	"user-read-playback-state",
	"user-modify-playback-state",
	"user-read-currently-playing",
	"streaming",
	"app-remote-control",
	"user-read-recently-played",
	"user-library-read",
	"user-library-modify",
	"user-top-read",
	"user-read-playback-position",
	"user-read-playback-state",
	"user-modify-playback-state",
	"user-read-currently-playing",
	"user-read-recently-played",
	"user-follow-read",
	"user-follow-modify",
];

export const Spotify: FC<PropsWithChildren> = ({ children }) => (
	<SpotifyProviderInternal
		options={{
			clientId: import.meta.env.VITE_SPOTIFY_CLIENT_ID,
			redirectUri: window.location.origin,
			scope: SPOTIFY_SCOPES,
		}}
	>
		{children}
	</SpotifyProviderInternal>
);
