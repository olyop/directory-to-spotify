import { FC, PropsWithChildren, createElement, useCallback } from "react";
import { WebPlaybackSDK } from "react-spotify-web-playback-sdk";

import { useSpotify } from "../../packages/spotify-web-api-react";

export const SpotifyWebPlaybackProvider: FC<PropsWithChildren> = ({ children }) => {
	const { client } = useSpotify();

	const getOAuthToken = useCallback((callback: (accessToken: string) => void) => {
		callback(client.token?.accessToken ?? "");
	}, []);

	return (
		<WebPlaybackSDK getOAuthToken={getOAuthToken} initialDeviceName={document.title} connectOnInitialized>
			{children}
		</WebPlaybackSDK>
	);
};
