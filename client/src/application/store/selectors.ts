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

		const { isMatching, workItemLoading, nowPlaying, isAdding } = store.workItems;

		const isAMatch = Object.values(workItems).some(workItem => workItem.match !== null);

		const total = Object.keys(workItems).length;

		const matched = Object.values(workItems)
			.map(({ match }) => match)
			.reduce((value, match) => (match ? value + 1 : value), 0);

		const matchesFound = Object.values(workItems).reduce((value, workItem) => {
			if (workItem.match && workItem.match.trackID !== null) {
				return value + 1;
			}

			return value;
		}, 0);

		let workItem: WorkItemInternal | null = null;

		if (workItemLoading) {
			const value = workItems[workItemLoading];

			if (!value) throw new Error(`Work item not found: ${workItemLoading}`);

			workItem = {
				...value,
				isSelected: false,
				isLoading: true,
				isPlaying: value.match?.trackID === nowPlaying,
			};
		}

		return {
			isMatching,
			isAdding,
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
