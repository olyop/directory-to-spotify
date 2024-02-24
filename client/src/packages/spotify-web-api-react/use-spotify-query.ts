import { useEffect, useState } from "react";

import { HttpMethod, SpotifyRequestData } from "./types";
import { useSpotifyFetch } from "./use-spotify-fetch";

export const useSpotifyQuery = <T extends Record<string, unknown>>(
	method: HttpMethod,
	path: string,
	requestData?: SpotifyRequestData,
) => {
	const spotifyFetch = useSpotifyFetch();

	const [isCalled, setIsCalled] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [data, setData] = useState<T | null>(null);

	const handleQuery = async () => {
		setLoading(true);
		setError(null);
		setData(null);

		try {
			const response = await spotifyFetch<T>(method, path, requestData);

			setData(response);
		} catch (requestError) {
			setError(requestError instanceof Error ? requestError.message : "Unknown error");
		} finally {
			setIsCalled(true);
			setLoading(false);
		}
	};

	useEffect(() => {
		if (!isCalled) {
			void handleQuery();
		}
	}, [isCalled]);

	return { loading, error, data } as const;
};
