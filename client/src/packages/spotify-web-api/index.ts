// eslint-disable-next-line unicorn/prevent-abbreviations
import { IndexedDbCacheProvider } from "./indexed-db-provider";
import { LocalStorageProvider } from "./local-storage-provider";
import {
	AccessTokenResponse,
	CacheProvider,
	SpotifyAuthorizationCodeOptions,
	SpotifyHooksOptions,
	SpotifyOAuthConfiguration,
	SpotifyOAuthOptions,
	SpotifyOptions,
	SpotifyQueryHttpMethod,
	SpotifyToken,
	SpotifyWebApiClientInter,
	SpotifyWebApiClientLogInOut,
	SpotifyWebApiClientMethods,
	SpotifyWebApiClientQuery,
	SpotifyWebApiClientQueryOptions,
	SpotifyWebApiClientState,
	StorageProvider,
	StorageProviderKeys,
} from "./types";
import { anySignal, deletePKCEVerifier, generatePKCEChallenge, retrievePKCEVerifier, sleep } from "./utilities";

export class SpotifyWebApiClient {
	#OPTIONS: SpotifyOptions;

	#abortController: AbortController;

	#token: SpotifyToken | null;

	constructor(optionsInput: SpotifyOptions) {
		this.#OPTIONS = { ...optionsInput };

		this.#abortController = new AbortController();

		this.#token = null;

		if (this.#OPTIONS.token) {
			this.#token = this.#OPTIONS.token;
		}

		if (this.#OPTIONS.storageProvider) {
			this.#token = this.#OPTIONS.storageProvider.getToken();
		}
	}

	async initialize() {
		if (this.#OPTIONS.cacheProvider) {
			await this.#OPTIONS.cacheProvider.initialize();
		}
	}

	get isAuthenticated() {
		return this.#token !== null;
	}

	get token() {
		return this.#token;
	}

	get isTokenExpired() {
		return this.#token ? this.#token.expiresAt < Date.now() : false;
	}

	get storageProvider() {
		return this.#OPTIONS.storageProvider ?? null;
	}

	get cacheProvider() {
		return this.#OPTIONS.cacheProvider ?? null;
	}

	login() {
		if (this.isAuthenticated) throw new Error("Authenticated");

		this.reset();

		void this.#redirectToAuthCodeFlow();
	}

	logout() {
		if (!this.isAuthenticated) throw new Error("Not authenticated");

		this.reset();

		this.#deleteToken();

		if (this.#OPTIONS.storageProvider) {
			deletePKCEVerifier(this.#OPTIONS.storageProvider);
		}
	}

	reset() {
		this.#abortController.abort();

		this.#abortController = new AbortController();

		this.#token = null;

		if (this.#OPTIONS.storageProvider) {
			this.#token = this.#OPTIONS.storageProvider.getToken();
		}
	}

	static isAuthenticatedInitial(storageProvider: StorageProvider) {
		return storageProvider.getToken() !== null;
	}

	setOptions(options: Partial<SpotifyOptions>) {
		this.#OPTIONS = {
			...this.#OPTIONS,
			...options,
		};

		if (
			!this.#OPTIONS.token ||
			!this.#OPTIONS.storageProvider ||
			!this.#OPTIONS.authorizationCode ||
			this.isTokenExpired
		) {
			return;
		}

		const codeVerifier = retrievePKCEVerifier(this.#OPTIONS.storageProvider);

		if (!codeVerifier) throw new Error("No code verifier found");

		void this.#initialRetrieveAccessToken(codeVerifier, this.#OPTIONS.authorizationCode);
	}

	async query<T>(method: SpotifyQueryHttpMethod, path: string, options?: SpotifyWebApiClientQueryOptions): Promise<T> {
		const signals: AbortSignal[] = [this.#abortController.signal];

		anySignal(signals).throwIfAborted();

		const url = new URL(`https://api.spotify.com/v1/${path}`);

		if (options?.searchParams) {
			for (const [key, value] of options.searchParams) {
				url.searchParams.append(key, value);
			}
		}

		const isJSON = options?.body !== undefined;

		if (options?.cache && this.#OPTIONS.cacheProvider && !isJSON) {
			const cached = await this.#OPTIONS.cacheProvider.get(url.toString());

			if (cached !== null) {
				return JSON.parse(cached) as T;
			}
		}

		const body = isJSON ? JSON.stringify(options.body) : null;

		const request = new Request(url, { method, body });

		if (isJSON) {
			request.headers.append("Content-Type", "application/json");
		}

		if (options?.signal) {
			signals.push(options.signal);
		}

		const signal = anySignal(signals);

		let accessToken: string;

		if (this.#token) {
			if (this.isTokenExpired) {
				accessToken = await this.#retreiveRefreshToken(signal);
			} else {
				accessToken = this.#token.accessToken;
			}
		} else {
			if (!this.#OPTIONS.storageProvider) throw new Error("No storage provider found");
			if (!this.#OPTIONS.authorizationCode) throw new Error("No authorization code found");

			const codeVerifier = retrievePKCEVerifier(this.#OPTIONS.storageProvider);

			if (!codeVerifier) throw new Error("No code verifier found");

			accessToken = await this.#initialRetrieveAccessToken(codeVerifier, this.#OPTIONS.authorizationCode);
		}

		request.headers.append("Authorization", `Bearer ${accessToken}`);

		const response = await fetch(request, { mode: "cors", signal });

		if (!response.ok) {
			// check for rate limit
			const retryAfterHeader = response.headers.get("Retry-After");

			if (retryAfterHeader !== null) {
				const retryAfter = Number.parseInt(retryAfterHeader); // seconds

				await sleep(retryAfter * 1000);

				return this.query<T>(method, path, options);
			}

			if (!options?.retry) {
				await sleep(1000);

				return this.query<T>(method, path, {
					...options,
					retry: true,
				});
			}

			throw new Error(`Failed to query: ${response.statusText}`);
		}

		const text = await response.text();

		if (options?.cache && this.#OPTIONS.cacheProvider && !isJSON) {
			await this.#OPTIONS.cacheProvider.set(url.toString(), text);
		}

		if (text.length === 0) {
			return {} as T;
		}

		return JSON.parse(text) as T;
	}

	async clearCache() {
		if (!this.#OPTIONS.cacheProvider) throw new Error("No cache provider found");

		await this.#OPTIONS.cacheProvider.clear();
	}

	async #redirectToAuthCodeFlow() {
		if (!this.#OPTIONS.storageProvider) throw new Error("No storage provider found");

		const codeChallenge = await generatePKCEChallenge(this.#OPTIONS.storageProvider);

		const url = new URL("https://accounts.spotify.com/authorize");

		url.searchParams.append("client_id", this.#OPTIONS.clientId);
		url.searchParams.append("response_type", "code");
		url.searchParams.append("redirect_uri", this.#OPTIONS.redirectUri);
		url.searchParams.append("scope", this.#OPTIONS.scope);
		url.searchParams.append("code_challenge_method", "S256");
		url.searchParams.append("code_challenge", codeChallenge);

		window.location.href = url.toString();
	}

	async #initialRetrieveAccessToken(codeVerifier: string, authorizationCode: string) {
		const accessToken = await this.#retrieveAccessToken(codeVerifier, authorizationCode);

		return accessToken;
	}

	async #retrieveAccessToken(codeVerifier: string, authorizationCode: string) {
		const url = new URL("https://accounts.spotify.com/api/token");

		url.searchParams.append("client_id", this.#OPTIONS.clientId);
		url.searchParams.append("grant_type", "authorization_code");
		url.searchParams.append("code", authorizationCode);
		url.searchParams.append("redirect_uri", this.#OPTIONS.redirectUri);
		url.searchParams.append("code_verifier", codeVerifier);

		const request = new Request(url, {
			method: "POST",
		});

		request.headers.append("Content-Type", "application/x-www-form-urlencoded");

		const response = await fetch(request, { signal: this.#abortController.signal });

		if (!response.ok) {
			throw new Error(`Failed to retrieve access token: ${response.statusText}`);
		}

		const token = await this.#convertAccessTokenResponse(response);

		this.#setToken(token);

		return token.accessToken;
	}

	async #retreiveRefreshToken(signal: AbortSignal) {
		if (this.#token === null) throw new Error("No token found");

		const url = new URL("https://accounts.spotify.com/api/token");

		url.searchParams.append("client_id", this.#OPTIONS.clientId);
		url.searchParams.append("grant_type", "refresh_token");
		url.searchParams.append("refresh_token", this.#token.refreshToken);

		const request = new Request(url, {
			method: "POST",
		});

		request.headers.append("Content-Type", "application/x-www-form-urlencoded");

		const response = await fetch(request, { signal });

		if (!response.ok) {
			throw new Error(`Failed to refresh access token: ${response.statusText}`);
		}

		const token = await this.#convertAccessTokenResponse(response);

		this.#setToken(token);

		return token.accessToken;
	}

	async #convertAccessTokenResponse(response: Response) {
		const json = (await response.json()) as AccessTokenResponse;

		const { access_token, token_type, scope, expires_in, refresh_token } = json;

		const accessToken: SpotifyToken = {
			accessToken: access_token,
			tokenType: token_type,
			scope,
			expiresAt: Date.now() + expires_in * 1000,
			refreshToken: refresh_token,
		};

		return accessToken;
	}

	#setToken(token: SpotifyToken) {
		this.#token = token;

		this.#OPTIONS.storageProvider?.setToken(token);

		this.#OPTIONS.onAuthenticatedChange?.(true);
	}

	#deleteToken() {
		this.#token = null;

		this.#OPTIONS.storageProvider?.removeToken();

		this.#OPTIONS.onAuthenticatedChange?.(false);
	}
}

export { LocalStorageProvider, IndexedDbCacheProvider };

export type {
	CacheProvider,
	SpotifyAuthorizationCodeOptions,
	SpotifyHooksOptions,
	SpotifyOAuthConfiguration,
	SpotifyOAuthOptions,
	SpotifyOptions,
	SpotifyQueryHttpMethod,
	SpotifyToken,
	SpotifyWebApiClientInter,
	SpotifyWebApiClientLogInOut,
	SpotifyWebApiClientMethods,
	SpotifyWebApiClientQuery,
	SpotifyWebApiClientQueryOptions,
	SpotifyWebApiClientState,
	StorageProvider,
	StorageProviderKeys,
};
