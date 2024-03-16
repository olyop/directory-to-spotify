import { FC, createElement } from "react";

import { WorkItemInternal } from "../types";
import { WorkItemViewMatchEdit } from "./edit";

export const WorkItemViewMatch: FC<WorkItemViewMatchProps> = ({ workItem }) => {
	if (workItem.match === null) return <div />;

	return <WorkItemViewMatchEdit workItem={workItem} />;
};

export interface WorkItemViewMatchProps {
	workItem: WorkItemInternal;
}
