export const PKCE_VERIFIER_POSSIBLE_CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

export interface SpotifyWebApiClientInter extends SpotifyWebApiClientState, SpotifyWebApiClientMethods {}

export interface SpotifyWebApiClientState {
	isAuthenticated: boolean;
}

export interface SpotifyWebApiClientMethods extends SpotifyWebApiClientLogInOut {
	query: SpotifyWebApiClientQuery;
	clearCache: () => Promise<void>;
}

export interface SpotifyWebApiClientLogInOut {
	login: () => void;
	logout: () => void;
}

export type SpotifyWebApiClientQuery = <T>(
	method: SpotifyQueryHttpMethod,
	path: string,
	options?: SpotifyWebApiClientQueryOptions,
) => Promise<T>;

export interface SpotifyOptions extends SpotifyAuthorizationCodeOptions, SpotifyOAuthOptions, SpotifyHooksOptions {
	storageProvider?: StorageProvider | null;
	cacheProvider?: CacheProvider | null;
}

export interface SpotifyAuthorizationCodeOptions {
	authorizationCode?: string | null;
}

export interface SpotifyOAuthOptions extends SpotifyOAuthConfiguration {
	token?: SpotifyToken;
}

export interface SpotifyOAuthConfiguration {
	clientId: string;
	redirectUri: string;
	scope: string;
}

export interface SpotifyHooksOptions {
	onAuthenticatedChange?: (isAuthenticated: boolean) => void;
	onErrorChange?: (error: Error) => void;
}

export type SpotifyQueryHttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export interface SpotifyWebApiClientQueryOptions {
	searchParams?: URLSearchParams;
	body?: Record<string, unknown> | null;
	signal?: AbortSignal;
	cache?: boolean;
	retry?: boolean;
}

export interface StorageProviderKeys {
	token: string;
	pkceVerifier: string;
}

export interface AccessTokenResponse {
	access_token: string;
	token_type: string;
	expires_in: number;
	refresh_token: string;
	scope: string;
}

export interface SpotifyToken {
	accessToken: string;
	tokenType: string;
	expiresAt: number;
	refreshToken: string;
	scope: string;
}

export interface StorageProvider {
	getToken(): SpotifyToken | null;
	getPKCEVerifier(): string | null;
	setToken(token: SpotifyToken): void;
	setPKCEVerifier(pkceVerifier: string): void;
	removeToken(): void;
	removePKCEVerifier(): void;
}

export interface CacheProvider {
	initialize(): Promise<void>;
	isReady: boolean;
	get(key: string): Promise<string | null>;
	set(key: string, value: string): Promise<string | null>;
	remove(key: string): Promise<string | null>;
	clear(): Promise<void>;
}
