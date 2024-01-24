import { SpotifyLogInOutButton } from "components/spotify-log-in-out-button";
import { FC } from "react";

export const GettingStarted: FC = () => (
	<div className="flex flex-col h-full items-center justify-center gap-8">
		<h2 className="text-2xl font-bold text-center">Welcome to Directory to Spotify!</h2>
		<p className="text-center">To get started, please log in to your Spotify account.</p>
		<SpotifyLogInOutButton isLogin />
	</div>
);
