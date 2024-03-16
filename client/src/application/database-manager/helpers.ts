import { IndexedDBRow } from "../../types";
import { WorkItem, WorkItemFile } from "../types";

const workItemSorter: Parameters<Array<WorkItem>["sort"]>[0] = (workItem1, workItem2) => {
	// order by year desc then album title then track number

	const year1 = workItem1.metadata.year ?? 0;
	const year2 = workItem2.metadata.year ?? 0;

	if (year1 < year2) return 1;
	if (year1 > year2) return -1;

	const album1 = workItem1.metadata.album ?? "";
	const album2 = workItem2.metadata.album ?? "";

	if (album1 < album2) return -1;
	if (album1 > album2) return 1;

	const trackNumber1 = workItem1.metadata.trackNumber ?? 0;
	const trackNumber2 = workItem2.metadata.trackNumber ?? 0;

	if (trackNumber1 < trackNumber2) return -1;
	if (trackNumber1 > trackNumber2) return 1;

	return 0;
};

const workItemsToObject = <T extends IndexedDBRow>(workItems: T[]) => {
	const workItemsObject: Record<string, T> = {};

	for (const workItem of workItems) {
		workItemsObject[workItem.id] = workItem;
	}

	return workItemsObject;
};

export const convertWorkItemFiles = (workItemFiles: WorkItemFile[]) => workItemsToObject(workItemFiles);
export const convertWorkItems = (workItems: WorkItem[]) => workItemsToObject(workItems.sort(workItemSorter));
