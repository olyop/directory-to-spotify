import spotifyLogoRedImage from "assets/spotify-logo-red.png";
import spotifyLogoImage from "assets/spotify-logo.png";
import { Button } from "components/button";
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
		<Button
			ariaLabel={buttonText}
			onClick={onClick}
			text={shouldCollapse ? undefined : buttonText}
			leftIcon={className => <img className={`${className} rounded-full h-6 w-6`} src={buttonImage} />}
			textClassName={`text-md ${isAuthenticated === false ? "text-red-500" : ""}`}
			className={`bg-transparent hover:bg-transparent hover:shadow-none border border-slate-500 h-auto py-3 gap-3 hover:!bg-slate-900 focus:!bg-slate-900 w-auto ${
				isAuthenticated === false ? "border-red-500" : ""
			} ${shouldCollapse ? "px-3" : "px-4"}`}
		/>
	);
};

interface Props {
	isAuthenticated: SpotifyContextIsAuthenticated;
	user: SpotifyContextUser;
	onClick: () => void;
}
