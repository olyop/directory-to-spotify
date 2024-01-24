import { DirectoryToSpotify } from "directory-to-spotify";
import { ControlBar } from "layouts/control-bar";
import { DirectoryChooser } from "layouts/directory-chooser";
import { GettingStarted } from "layouts/getting-started";
import { FC, useState } from "react";
import { useSpotify } from "spotify-web-api-react";

export const Content: FC = () => {
	const { isAuthenticated } = useSpotify();

	const [isMain, setIsMain] = useState(false);

	const handleSetMain = () => {
		setIsMain(true);
	};

	return (
		<div className="w-full h-full flex flex-col overflow-hidden">
			<div className="w-full h-content-height flex flex-col justify-between">
				{isAuthenticated ? isMain ? <DirectoryToSpotify /> : <DirectoryChooser /> : <GettingStarted />}
			</div>
			<ControlBar handleSetMain={handleSetMain} />
		</div>
	);
};
