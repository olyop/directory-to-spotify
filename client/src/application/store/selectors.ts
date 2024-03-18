import { shallowEqual } from "react-redux";

import { AppState, useAppSelector } from ".";
import { WorkItemInternal } from "../spotify-library-matcher/work-item-view/types";
import { WorkItem } from "../types";

export function useWorkItemInternalSelector(workItemID: string) {
	return useAppSelector(store => {
		const workItems = getWorkItems(store);
		const workItem = getWorkItem(workItems, workItemID);

		const isLoading = Object.values(workItems).some(
			workItemValue => workItemValue.id === workItem.id && store.workItems.workItemLoading === workItemValue.id,
		);

		const isSelected = store.workItems.selected?.id === workItem.id;

		const workItemInternal: WorkItemInternal = {
			...workItem,
			isLoading,
			isSelected,
			isPlaying: store.workItems.nowPlaying === workItem.match?.trackID,
		};

		return workItemInternal;
	}, shallowEqual);
}

export function useSelectedSelector() {
	return useAppSelector(store => store.workItems.selected, shallowEqual);
}

export function useWorkItemsControlsSelector() {
	return useAppSelector(store => {
		const workItems = getWorkItems(store);

		const { isMatching, isClearing, isAdding, workItemLoading } = store.workItems;

		let isAMatch = false;
		let total = 0;
		let matched = 0;
		let matchesFound = 0;

		Object.values(workItems).forEach(workItem => {
			if (workItem.match !== null) {
				if (!isAMatch) {
					isAMatch = true;
				}

				if (workItem.match.trackID !== null) {
					matchesFound += 1;
				}

				matched += 1;
			}

			total += 1;
		});

		let workItem: WorkItemInternal | null = null;

		if (workItemLoading) {
			const value = workItems[workItemLoading];

			if (!value) throw new Error(`Work item not found: ${workItemLoading}`);

			workItem = {
				...value,
				isSelected: false,
				isLoading: false,
				isPlaying: false,
			};
		}

		return {
			isMatching,
			isAdding,
			isClearing,
			isAMatch,
			total,
			matched,
			matchesFound,
			workItem,
		};
	}, shallowEqual);
}

function getWorkItem(workItems: Record<string, WorkItem>, workItemID: string) {
	const workItem = workItems[workItemID];

	if (!workItem) throw new Error(`Work item not found: ${workItemID}`);

	return workItem;
}

function getWorkItems(state: AppState) {
	if (!state.workItems.workItems) throw new Error("Work items not found");

	return state.workItems.workItems;
}
