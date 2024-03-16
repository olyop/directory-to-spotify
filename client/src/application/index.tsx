import { FC, createElement } from "react";

import { DatabaseManagerProvider } from "./database-manager/provider";
import { DirectoryToSpotify as DirectoryToSpotifyInternal } from "./directory-to-spotify";
import { ReduxStoresProvider } from "./store/provider";

export const DirectoryToSpotify: FC = () => (
	<DatabaseManagerProvider>
		<ReduxStoresProvider>
			<DirectoryToSpotifyInternal />
		</ReduxStoresProvider>
	</DatabaseManagerProvider>
);
