import { FC, PropsWithChildren, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

import {
	convertUserData,
	deleteStoredAccessToken,
	deleteStoredUser,
	redirectToAuthCodeFlow,
	retrieveAccessToken,
	retrieveStoredAccessToken,
	retrieveStoredUser,
	storeUser,
} from "./oauth-helpers";
import { SpotifyContext } from "./spotify-context";
import { SpotifyInternalOptions, SpotifyProviderProps, SpotifyUser } from "./types";
import { spotifyInputToInternalOptions, spotifyRequest } from "./utilities";

export { useSpotify } from "./use-spotify";
export { useSpotifyFetch } from "./use-spotify-fetch";
export { useSpotifyQuery } from "./use-spotify-query";

export const SpotifyProvider: FC<PropsWithChildren<SpotifyProviderProps>> = ({ options: optionsProp, children }) => {
	const [searchParams, setSearchParams] = useSearchParams();

	const optionsRef = useRef<SpotifyInternalOptions>(spotifyInputToInternalOptions(optionsProp));

	const [code, setCode] = useState<string | null>(null);
	const [isAuthenticated, setIsAuthenticated] = useState(retrieveStoredAccessToken() === null ? null : true);
	const [user, setUser] = useState<SpotifyUser | null>(retrieveStoredUser());

	const codeSearchParam = searchParams.get("code");
	const errorSearchParam = searchParams.get("error");

	const spotifyLogin = () => {
		void redirectToAuthCodeFlow(optionsRef.current);
	};

	const spotifyLogout = () => {
		deleteStoredAccessToken();
		deleteStoredUser();

		setIsAuthenticated(null);
		setUser(null);
	};

	const handleRemoveCodeSearchParam = () => {
		if (searchParams.has("code")) {
			searchParams.delete("code");

			setSearchParams(searchParams);
		}
	};

	const handleRemoveErrorSearchParam = () => {
		if (searchParams.has("error")) {
			searchParams.delete("error");

			setSearchParams(searchParams, {
				replace: true,
			});
		}
	};

	const handleUser = async () => {
		const data = await spotifyRequest(optionsRef.current)("GET", "me");

		const userData = convertUserData(data);

		storeUser(userData);
		setUser(userData);
	};

	const handleAuthentication = async () => {
		if (code) {
			try {
				await retrieveAccessToken(optionsRef.current, code);

				setIsAuthenticated(true);

				void handleUser();
			} catch {
				setIsAuthenticated(false);
			}
		}
	};

	const handleCode = () => {
		setCode(codeSearchParam);
		handleRemoveCodeSearchParam();
	};

	const handleAuthorizationError = () => {
		handleRemoveErrorSearchParam();

		setIsAuthenticated(false);
	};

	useEffect(() => {
		if (codeSearchParam && !isAuthenticated) {
			handleCode();
		}
	}, [codeSearchParam]);

	useEffect(() => {
		if (errorSearchParam) {
			handleAuthorizationError();
		}
	}, [errorSearchParam]);

	useEffect(() => {
		if (code) {
			void handleAuthentication();
		}
	}, [code]);

	const { current: options } = optionsRef;

	return (
		<SpotifyContext.Provider
			value={{
				spotifyLogin,
				spotifyLogout,
				options,
				isAuthenticated,
				user,
			}}
		>
			{children}
		</SpotifyContext.Provider>
	);
};
