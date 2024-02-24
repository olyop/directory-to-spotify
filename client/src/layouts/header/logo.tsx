import logo from "assets/logo.png";
import { Breakpoint, useBreakpoint } from "hooks/use-breakpoint";
import { FC } from "react";

export const HeaderLogo: FC = () => {
	const breakpoint = useBreakpoint();

	const shouldCollapse = breakpoint === Breakpoint.TINY || breakpoint === Breakpoint.SMALL;

	return (
		<a
			href={window.location.origin}
			aria-label="Directory to Spotify"
			className="absolute top-1/2 px-4 py-2 left-1/2 -translate-y-1/2 -translate-x-1/2 flex items-center gap-4 justify-center transition-colors rounded-lg bg-slate-800 z-10 hover:bg-slate-700 select-none"
		>
			<img src={logo} alt="Directory to Spotify logo" className="h-7" />
			<span className="text-3xl lowercase mt-[-2px]">{shouldCollapse ? "dts" : "Directory to Spotify"}</span>
		</a>
	);
};
