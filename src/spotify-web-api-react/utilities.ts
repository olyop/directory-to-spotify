import { handleToken } from "./oauth-helpers";
import { HttpMethod, SpotifyInternalOptions, SpotifyOptions, SpotifyRequestData } from "./types";

export const spotifyInputToInternalOptions = ({ scope, ...options }: SpotifyOptions): SpotifyInternalOptions => ({
	...options,
	scope: scope.join(" "),
});

const getAccessToken = async (options: SpotifyInternalOptions) => {
	const token = await handleToken(options);

	if (token === null) {
		throw new Error("Not authenticated");
	}

	return token.accessToken;
};

export const spotifyRequest =
	// eslint-disable-next-line arrow-body-style
	(options: SpotifyInternalOptions) => {
		return async <T extends Record<string, unknown>>(
			method: HttpMethod,
			path: string,
			data?: SpotifyRequestData,
		): Promise<T> => {
			const url = new URL(`/v1/${path}`, "https://api.spotify.com");

			if (data instanceof URLSearchParams) {
				for (const [key, value] of data) {
					url.searchParams.append(key, value);
				}
			}

			const isJSON = data !== undefined && !(data instanceof URLSearchParams);

			const request = new Request(url, { method, body: isJSON ? JSON.stringify(data) : null });

			if (isJSON) {
				request.headers.append("Content-Type", "application/json");
			}

			const token = await getAccessToken(options);

			request.headers.append("Authorization", `Bearer ${token}`);

			const response = await fetch(request);

			if (!response.ok) {
				throw new Error(response.statusText);
			}

			const text = await response.text();

			// check if has content
			if (text.length === 0) {
				return text as unknown as T;
			}

			return JSON.parse(text) as T;
		};
	};
