import spotifyLogoRedImage from "assets/spotify-logo-red.png";
import spotifyLogoImage from "assets/spotify-logo.png";
import { LayoutButton } from "components/layout-button";
import { Breakpoint, useBreakpoint } from "hooks/use-breakpoint";
import { SpotifyContextIsAuthenticated, SpotifyContextUser } from "packages/spotify-web-api-react/types";
import { FC } from "react";

import { determineButtonValueFromStatus } from "./helpers";

export const HeaderAccountButton: FC<Props> = ({ isAuthenticated, user, onClick }) => {
	const breakpoint = useBreakpoint();

	const determineButtonValue = determineButtonValueFromStatus(isAuthenticated, user);

	const buttonText = determineButtonValue("Account", "Loading", user?.name, "Denied");
	const buttonImage = determineButtonValue(spotifyLogoImage, spotifyLogoImage, user?.photoUrl, spotifyLogoRedImage);

	const shouldCollapse = breakpoint === Breakpoint.TINY || breakpoint === Breakpoint.SMALL;

	return (
		<LayoutButton
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
