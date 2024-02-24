export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export interface AccessTokenBase {
	scope: string;
}

export interface AccessTokenResponse extends AccessTokenBase {
	access_token: string;
	token_type: string;
	expires_in: number;
	refresh_token: string;
}

export interface AccessToken extends AccessTokenBase {
	accessToken: string;
	tokenType: string;
	expiresAt: number;
	refreshToken: string;
}

interface SpotifyBaseOptions {
	clientId: string;
	redirectUri: string;
	defaultProfileImagePath: string;
}

export interface SpotifyOptions extends SpotifyBaseOptions {
	scope: string[];
}

export interface SpotifyInternalOptions extends SpotifyBaseOptions {
	scope: string;
}

export type SpotifyRequestData = URLSearchParams | Record<string, unknown>;

export interface SpotifyUser extends Record<string, string> {
	id: string;
	name: string;
	photoUrl: string;
	spotifyUrl: string;
	emailAddress: string;
}

export type SpotifyContextIsAuthenticated = boolean | null;
export type SpotifyContextUser = SpotifyUser | null;

export interface SpotifyContext {
	spotifyLogin: () => void;
	spotifyLogout: () => void;
	options: SpotifyInternalOptions;
	isAuthenticated: SpotifyContextIsAuthenticated;
	user: SpotifyContextUser;
}

export interface SpotifyProviderProps {
	options: SpotifyOptions;
}
