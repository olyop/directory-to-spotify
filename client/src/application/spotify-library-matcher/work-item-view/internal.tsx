import { FC, Fragment, createElement } from "react";

import { useWorkItemInternalSelector } from "../../store/selectors";
import { ViewLocalFileItem } from "../view-item/view-local-file-item";
import { ViewSpotifyTrackItem } from "../view-item/view-spotify-track-item";
import { WorkItemViewMatch } from "./match";

export const WorkItemViewInternal: FC<WorkItemViewInternalProps> = ({ workItemID }) => {
	const workItem = useWorkItemInternalSelector(workItemID);
	return (
		<Fragment>
			<ViewLocalFileItem workItem={workItem} />
			<WorkItemViewMatch workItem={workItem} />
			{workItem.match?.trackID && (
				<ViewSpotifyTrackItem
					trackID={workItem.match.trackID}
					className="!grid-cols-[1fr,3.5rem]"
					imageClassName="order-1"
					contentClassName="pl-2 pr-3"
					textClassName="text-right"
				/>
			)}
		</Fragment>
	);
};

export interface WorkItemViewInternalProps {
	workItemID: string;
}
