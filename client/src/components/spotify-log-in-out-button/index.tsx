import { FC, createElement } from "react";

import spotifyLogo from "../../assets/spotify-logo.png";
import { useSpotify } from "../../packages/spotify-web-api-react";
import { Button } from "../button";

export const SpotifyLogInOutButton: FC<Props> = ({ isLogin, onClick }) => {
	const { login, logout } = useSpotify();

	const handleOnClick = () => {
		onClick?.();

		if (isLogin) {
			login();
		} else {
			logout();
		}
	};

	return (
		<Button
			text={isLogin ? "Log in" : "Log out"}
			ariaLabel={isLogin ? "Log in" : "Log out"}
			onClick={handleOnClick}
			className={isLogin ? "!h-14 gap-4 px-6" : undefined}
			textClassName={isLogin ? "text-2xl" : undefined}
			iconClassName={isLogin ? "!w-9 !h-9" : undefined}
			leftIcon={className => <img src={spotifyLogo} className={className} alt="Spotify Logo" />}
		/>
	);
};

interface Props {
	isLogin: boolean;
	onClick?: () => void;
}
