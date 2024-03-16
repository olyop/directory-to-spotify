import { WorkItem } from "../../types";

export interface WorkItemInternal extends WorkItem {
	isLoading: boolean;
	isPlaying: boolean;
	isSelected: boolean;
}
