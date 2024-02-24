import logoImagePath from "assets/logo.png";
import { SpotifyLogInOutButton } from "components/spotify-log-in-out-button";
import { FC } from "react";

export const GettingStarted: FC = () => (
	<div className="w-full h-full">
		<div className="flex flex-col h-content-height items-center justify-center gap-8">
			<img src={logoImagePath} className="h-16 w-16" />
			<h2 className="text-2xl font-bold text-center">Welcome to Directory to Spotify!</h2>
			<p className="text-center">To get started, please log in to your Spotify account.</p>
			<SpotifyLogInOutButton isLogin />
		</div>
		<div className="bg-slate-800 flex items-center justify-center gap-6 p-4 w-full h-control-bar-height shadow-2xl"></div>
	</div>
);
