import defaultProfileImage from "assets/default-profile.png";

import { AccessToken, AccessTokenResponse, SpotifyInternalOptions, SpotifyUser } from "./types";

const VERIFIER_POSSIBLE_CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const USER_LOCAL_STORAGE_KEY = "spotify-web-api-react-auth-user";
const VERIFIER_LOCAL_STORAGE_KEY = "spotify-web-api-react-auth-verifier";
const ACCESS_TOKEN_LOCAL_STORAGE_KEY = "spotify-web-api-react-auth-access-token";

const generateRandomString = (length: number) =>
	crypto
		.getRandomValues(new Uint8Array(length))
		.reduce(
			(accumulator, character) =>
				accumulator + VERIFIER_POSSIBLE_CHARACTERS[character % VERIFIER_POSSIBLE_CHARACTERS.length],
			"",
		);

const sha256 = async (plain: string) => {
	const encoder = new TextEncoder();
	const data = encoder.encode(plain);
	return window.crypto.subtle.digest("SHA-256", data);
};

const base64encode = (value: ArrayBuffer) =>
	btoa(String.fromCodePoint(...new Uint8Array(value)))
		.replaceAll("+", "-")
		.replaceAll("/", "_")
		.replace(/=+$/, "");

const generateCodeChallenge = async (codeVerifier: string) => base64encode(await sha256(codeVerifier));

export const redirectToAuthCodeFlow = async (options: SpotifyInternalOptions) => {
	const codeVerifier = generateRandomString(128);
	const codeChallenge = await generateCodeChallenge(codeVerifier);

	localStorage.setItem(VERIFIER_LOCAL_STORAGE_KEY, codeVerifier);

	const url = new URL("https://accounts.spotify.com/authorize");

	url.searchParams.append("client_id", options.clientId);
	url.searchParams.append("response_type", "code");
	url.searchParams.append("redirect_uri", options.redirectUri);
	url.searchParams.append("scope", options.scope);
	url.searchParams.append("code_challenge_method", "S256");
	url.searchParams.append("code_challenge", codeChallenge);

	window.location.href = url.toString();
};

const convertAccessTokenResponse = async (response: Response): Promise<AccessToken> => {
	const { access_token, token_type, scope, expires_in, refresh_token } = (await response.json()) as AccessTokenResponse;
	return {
		accessToken: access_token,
		tokenType: token_type,
		scope,
		expiresAt: Date.now() + expires_in * 1000,
		refreshToken: refresh_token,
	};
};

const storeAccessToken = (accessToken: AccessToken) => {
	localStorage.setItem(ACCESS_TOKEN_LOCAL_STORAGE_KEY, JSON.stringify(accessToken));
};

export const retrieveAccessToken = async (options: SpotifyInternalOptions, code: string) => {
	const codeVerifier = localStorage.getItem(VERIFIER_LOCAL_STORAGE_KEY);

	if (!codeVerifier) {
		throw new Error("No verifier found");
	}

	const url = new URL("https://accounts.spotify.com/api/token");

	url.searchParams.append("client_id", options.clientId);
	url.searchParams.append("grant_type", "authorization_code");
	url.searchParams.append("code", code);
	url.searchParams.append("redirect_uri", options.redirectUri);
	url.searchParams.append("code_verifier", codeVerifier);

	const request = new Request(url, {
		method: "POST",
	});

	request.headers.append("Content-Type", "application/x-www-form-urlencoded");

	const response = await fetch(request);

	if (!response.ok) {
		throw new Error(`Failed to retrieve access token: ${response.statusText}`);
	}

	const newAccessToken = await convertAccessTokenResponse(response);

	storeAccessToken(newAccessToken);

	return newAccessToken;
};

const refreshAccessToken = async (options: SpotifyInternalOptions, accessToken: AccessToken) => {
	const url = new URL("https://accounts.spotify.com/api/token");

	url.searchParams.append("client_id", options.clientId);
	url.searchParams.append("grant_type", "refresh_token");
	url.searchParams.append("refresh_token", accessToken.refreshToken);

	const request = new Request(url, {
		method: "POST",
	});

	request.headers.append("Content-Type", "application/x-www-form-urlencoded");

	const response = await fetch(request);

	if (!response.ok) {
		throw new Error(`Failed to refresh access token: ${response.statusText}`);
	}

	const newAccessToken = await convertAccessTokenResponse(response);

	storeAccessToken(newAccessToken);

	return newAccessToken;
};

export const retrieveStoredAccessToken = () => {
	const accessTokenJson = localStorage.getItem(ACCESS_TOKEN_LOCAL_STORAGE_KEY);

	if (!accessTokenJson) {
		return null;
	}

	return JSON.parse(accessTokenJson) as AccessToken;
};

export const deleteStoredAccessToken = () => {
	if (localStorage.getItem(ACCESS_TOKEN_LOCAL_STORAGE_KEY)) {
		localStorage.removeItem(ACCESS_TOKEN_LOCAL_STORAGE_KEY);
	}
};

export const handleToken = async (options: SpotifyInternalOptions) => {
	const storedAccessToken = retrieveStoredAccessToken();

	if (storedAccessToken) {
		const isExpired = storedAccessToken.expiresAt < Date.now();

		if (isExpired) {
			return refreshAccessToken(options, storedAccessToken);
		} else {
			return storedAccessToken;
		}
	} else {
		return null;
	}
};

export const storeUser = (user: SpotifyUser) => {
	localStorage.setItem(USER_LOCAL_STORAGE_KEY, JSON.stringify(user));
};

export const retrieveStoredUser = () => {
	const userJson = localStorage.getItem(USER_LOCAL_STORAGE_KEY);

	if (!userJson) {
		return null;
	}

	return JSON.parse(userJson) as SpotifyUser;
};

export const deleteStoredUser = () => {
	if (localStorage.getItem(USER_LOCAL_STORAGE_KEY)) {
		localStorage.removeItem(USER_LOCAL_STORAGE_KEY);
	}
};

export const convertUserData = (data: Record<string, unknown>): SpotifyUser => {
	const idData = data["id"];
	const nameData = data["display_name"];
	const emailAddressData = data["email"];
	const photoUrlData = data["images"];
	const spotifyUrlData = data["external_urls"];

	if (typeof idData !== "string") {
		throw new TypeError("No user ID found");
	}

	if (typeof nameData !== "string") {
		throw new TypeError("No user name found");
	}

	if (typeof emailAddressData !== "string") {
		throw new TypeError("No user email address found");
	}

	let photoUrl: string = defaultProfileImage;
	if (Array.isArray(photoUrlData)) {
		const photoUrlDataTyped = photoUrlData as Record<string, unknown>[];

		// check is not empty
		if (photoUrlDataTyped.length > 0) {
			const photoUrlImageData = photoUrlDataTyped[0];

			if (typeof photoUrlImageData === "object") {
				photoUrl = (photoUrlImageData as Record<string, string>)["url"] as string;
			}
		}
	}

	let spotifyUrl: string;

	if (typeof spotifyUrlData === "object") {
		const spotifyUrlItemData = (spotifyUrlData as Record<string, string>)["spotify"];

		if (typeof spotifyUrlItemData === "string") {
			spotifyUrl = spotifyUrlItemData;
		} else {
			throw new TypeError("No user Spotify URL found");
		}
	} else {
		throw new TypeError("No user Spotify URL found");
	}

	return {
		id: idData,
		name: nameData,
		emailAddress: emailAddressData,
		photoUrl,
		spotifyUrl,
	};
};
