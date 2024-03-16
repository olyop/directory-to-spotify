import { FC, PropsWithChildren, createElement, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { SpotifyWebApiClient } from "../spotify-web-api";
import { SpotifyContext } from "./spotify-context";
import {
	SpotifyContext as SpotifyContextType,
	SpotifyReactProviderProps,
	SpotifyUser,
	SpotifyWebApiReactContextUser,
	SpotifyWebApiReactOptions,
} from "./types";
import { deleteStoredUser, getUser, retrieveStoredUser } from "./user";

export { useSpotify } from "./use-spotify";
export { useSpotifyQuery } from "./use-spotify-query";

export const SpotifyWebApiReactProvider: FC<PropsWithChildren<SpotifyReactProviderProps>> = ({
	client,
	options,
	children,
}) => {
	const [searchParams, setSearchParams] = useSearchParams();

	const authorizationCode = searchParams.get("code");

	const initialIsAuthenticated = client.storageProvider
		? SpotifyWebApiClient.isAuthenticatedInitial(client.storageProvider)
		: false;

	const [isAuthenticated, setIsAuthenticated] = useState(initialIsAuthenticated);
	const [isStorageReady, setIsStorageReady] = useState(client.cacheProvider?.isReady ?? false);

	const handleAuthorizationCodeDelete = () => {
		if (searchParams.has("code")) {
			setSearchParams(prevState => {
				prevState.delete("code");
				return prevState;
			});
		}
	};

	const handleSetIsAuthenticated = (value: boolean) => {
		setIsAuthenticated(value);
		handleAuthorizationCodeDelete();
	};

	client.setOptions({
		authorizationCode,
		onAuthenticatedChange: handleSetIsAuthenticated,
	});

	const clientRef = useRef<SpotifyWebApiClient>(client);

	const [user, setUser] = useState<SpotifyUser | null>(retrieveStoredUser());

	const login = () => {
		clientRef.current.login();
	};

	const logout = () => {
		deleteStoredUser();
		setUser(null);

		clientRef.current.logout();
	};

	const handleUser = async () => {
		if (!authorizationCode) return;

		const userValue = await getUser(clientRef.current, options?.defaultProfileImagePath);

		setUser(userValue);
	};

	const handleInitialization = async () => {
		await clientRef.current.initialize();

		setIsStorageReady(true);

		await handleUser();
	};

	useEffect(() => {
		if (isStorageReady) return;

		void handleInitialization();
	}, [isStorageReady]);

	const contextValue: SpotifyContextType = useMemo(
		() => ({
			client: clientRef.current,
			isAuthenticated,
			isLoading: false,
			login,
			logout,
			user,
		}),
		[isAuthenticated, user],
	);

	return <SpotifyContext.Provider value={contextValue}>{children}</SpotifyContext.Provider>;
};

export type {
	SpotifyContext as SpotifyContextType,
	SpotifyReactProviderProps,
	SpotifyUser,
	SpotifyWebApiReactContextUser,
	SpotifyWebApiReactOptions,
};
