import { FC, Fragment, createElement } from "react";

import logoImagePath from "../../assets/logo.png";
import { Page } from "../../components/page";
import { SpotifyLogInOutButton } from "../../components/spotify-log-in-out-button";

export const GettingStarted: FC = () => (
	<Page
		contentClassName="flex flex-col items-center justify-center gap-8"
		contentNode={
			<Fragment>
				<img src={logoImagePath} className="size-16" alt="Spotify" />
				<h2 className="text-center text-2xl font-bold">Welcome to Directory to Spotify!</h2>
				<p className="text-center">To get started, please log in to your Spotify account.</p>
			</Fragment>
		}
		controlsClassName="!justify-end"
		controlsNode={<SpotifyLogInOutButton isLogin />}
	/>
);
