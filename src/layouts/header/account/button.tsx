import spotifyLogoRedImage from "assets/spotify-logo-red.png";
import spotifyLogoImage from "assets/spotify-logo.png";
import { BigButton } from "components/big-button";
import { Breakpoint, useBreakpoint } from "hooks/use-breakpoint";
import { FC } from "react";
import { SpotifyContextIsAuthenticated, SpotifyContextUser } from "spotify-web-api-react/types";

import { determineButtonValueFromStatus } from "./helpers";

export const HeaderAccountButton: FC<Props> = ({ isAuthenticated, user, onClick }) => {
	const breakpoint = useBreakpoint();

	const determineButtonValue = determineButtonValueFromStatus(isAuthenticated, user);

	const buttonText = determineButtonValue("Account", "Loading", user?.name, "Denied");
	const buttonImage = determineButtonValue(spotifyLogoImage, spotifyLogoImage, user?.photoUrl, spotifyLogoRedImage);

	const shouldCollapse = breakpoint === Breakpoint.TINY || breakpoint === Breakpoint.SMALL;

	return (
		<BigButton
			ariaLabel={buttonText}
			onClick={onClick}
			text={shouldCollapse ? undefined : buttonText}
			leftIcon={className => <img className={className} src={buttonImage} />}
			textClassName={isAuthenticated === false ? "text-red-500" : ""}
			className={`${isAuthenticated === false ? "border-red-500" : ""} ${shouldCollapse ? "px-3" : ""}`}
		/>
	);
};

interface Props {
	isAuthenticated: SpotifyContextIsAuthenticated;
	user: SpotifyContextUser;
	onClick: () => void;
}
