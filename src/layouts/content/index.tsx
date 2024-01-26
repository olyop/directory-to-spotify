import { DirectoryToSpotify } from "directory-to-spotify";
import { GettingStarted } from "layouts/getting-started";
import { FC } from "react";
import { useSpotify } from "spotify-web-api-react";

export const Content: FC = () => {
	const { isAuthenticated } = useSpotify();

	return (
		<div className="w-full h-full flex flex-col overflow-hidden">
			{isAuthenticated ? <DirectoryToSpotify /> : <GettingStarted />}
		</div>
	);
};
