import { ReactNode } from "react";

import { WorkItemSelected } from "../../store/work-items-store";

export interface SidebarTrackContent extends WorkItemSelected {
	image: ((className: string) => ReactNode) | null;
	title: string;
	artist: string;
	album: string;
	albumArtist: string;
	year: string;
}
