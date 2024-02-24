import { GettingStarted } from "layouts/getting-started";
import { DirectoryToSpotify } from "packages/directory-to-spotify";
import { useSpotify } from "packages/spotify-web-api-react";
import { FC } from "react";

export const Content: FC = () => {
	const { isAuthenticated } = useSpotify();

	return (
		<div className="w-full h-full flex flex-col overflow-hidden">
			{isAuthenticated ? <DirectoryToSpotify /> : <GettingStarted />}
		</div>
	);
};
