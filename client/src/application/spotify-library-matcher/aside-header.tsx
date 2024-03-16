import { MusicalNoteIcon, PencilIcon } from "@heroicons/react/24/outline";
import { FC, Fragment, createElement } from "react";

import spotifyLogo from "../../assets/spotify-logo.png";
import { useSelectedSelector } from "../store/selectors";

export const AsideHeader: FC = () => {
	const selected = useSelectedSelector();

	if (!selected) return <div />;

	return (
		<Fragment>
			{selected.type === "metadata" ? (
				<Fragment>
					<MusicalNoteIcon className="size-6" />
					<p className="uppercase">Local File</p>
				</Fragment>
			) : selected.type === "match" ? (
				<Fragment>
					<PencilIcon className="size-6" />
					<p className="uppercase">Match</p>
				</Fragment>
			) : (
				<Fragment>
					<img src={spotifyLogo} alt="Spotify" className="size-6" />
					<p className="uppercase">Spotify Track</p>
				</Fragment>
			)}
		</Fragment>
	);
};
