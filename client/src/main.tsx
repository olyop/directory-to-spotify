import { FC, createElement } from "react";
import { BrowserRouter as Router } from "react-router-dom";

import { Content } from "./content";
import { SpotifyProvider as Spotify } from "./providers/spotify";

export const Main: FC = () => (
	<Router>
		<Spotify>
			<Content />
		</Spotify>
	</Router>
);
