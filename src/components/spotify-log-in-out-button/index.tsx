import spotifyLogo from "assets/spotify-logo.png";
import { Button } from "components/button";
import { FC } from "react";
import { useSpotify } from "spotify-web-api-react";

export const SpotifyLogInOutButton: FC<Props> = ({ isLogin, onClick }) => {
	const { spotifyLogin, spotifyLogout } = useSpotify();

	const handleOnClick = () => {
		onClick?.();

		if (isLogin) {
			spotifyLogin();
		} else {
			spotifyLogout();
		}
	};

	return (
		<Button
			text={isLogin ? "Log in" : "Log out"}
			ariaLabel={isLogin ? "Log in" : "Log out"}
			onClick={handleOnClick}
			className={isLogin ? "!h-14 px-6 gap-4" : undefined}
			textClassName={isLogin ? "text-2xl" : undefined}
			iconClassName={isLogin ? "!w-9 !h-9" : undefined}
			leftIcon={className => <img src={spotifyLogo} className={className} />}
		/>
	);
};

interface Props {
	isLogin: boolean;
	onClick?: () => void;
}
