import { FC, createElement } from "react";

import { useSelectedSelector } from "../../store/selectors";
import { AsideLocalFileContent } from "./local-file";
import { AsideMatchContent } from "./match";
import { AsideSpotifyTrackContent } from "./spotify-track";

export const AsideContent: FC = () => {
	const selected = useSelectedSelector();

	if (!selected) return null;

	return selected.type === "spotify" ? (
		<AsideSpotifyTrackContent trackID={selected.id} />
	) : selected.type === "match" ? (
		<AsideMatchContent id={selected.id} />
	) : (
		<AsideLocalFileContent id={selected.id} />
	);
};
