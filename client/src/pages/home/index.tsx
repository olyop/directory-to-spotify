import { FC, createElement } from "react";

import { DirectoryToSpotify } from "../../application";
import { useSpotify } from "../../packages/spotify-web-api-react";
import { GettingStarted } from "../getting-started";
import { Loading } from "../loading";

export const HomePage: FC = () => {
	const { isAuthenticated, isLoading } = useSpotify();

	return isLoading ? <Loading /> : isAuthenticated ? <DirectoryToSpotify /> : <GettingStarted />;
};
