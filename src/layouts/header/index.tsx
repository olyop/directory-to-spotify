import { FC } from "react";

const Header: FC = () => (
	<div className="flex items-center gap-8 justify-center py-8">
		<img src="/logo.png" alt="Directory to Spotify logo" className="w-12 h-12" />
		<a className="text-4xl" href={window.location.origin} aria-label="Directory to Spotify">
			Directory to Spotify
		</a>
	</div>
);

export default Header;
