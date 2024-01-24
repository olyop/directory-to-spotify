import { Button } from "components/button";
import { FC } from "react";
import { useSpotify } from "spotify-web-api-react";

export const ControlBar: FC<ControlBarProps> = ({ handleSetMain }) => {
	const { isAuthenticated } = useSpotify();

	return (
		<div className="bg-slate-600 flex flex-row-reverse p-4 w-full h-control-bar-height shadow-2xl">
			{isAuthenticated && <Button ariaLabel="Next" text="Next" onClick={handleSetMain} />}
		</div>
	);
};

export interface ControlBarProps {
	handleSetMain: () => void;
}
