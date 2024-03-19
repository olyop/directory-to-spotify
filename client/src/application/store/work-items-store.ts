/* eslint-disable no-param-reassign */
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

// eslint-disable-next-line import/no-cycle
import { CreateStoreOptions } from ".";
import { IndexedDBRow } from "../../types";
import { WorkItem, WorkItemMatch, WorkItemMatchType } from "../types";

export const createWorkItemsStore = (options: CreateStoreOptions) => {
	const initialState: WorkItemsState = {
		scanStatus: null,
		workItems: options.workItems,
		workItemLoading: null,
		selected: null,
		filter: false,
		nowPlaying: null,
		isMatching: false,
		isAdding: false,
		isClearing: false,
	};

	return createSlice({
		name: "workItems",
		initialState,
		reducers: {
			clearStatus: state => {
				state.scanStatus = null;
			},
			addWorkItem: (state, action: PayloadAction<WorkItem>) => {
				state.scanStatus = action.payload.path;

				if (state.workItems === null) {
					state.workItems = {};
				}

				state.workItems[action.payload.id] = action.payload;
			},
			skipWorkItem: (state, action: PayloadAction<string>) => {
				if (state.workItems === null) {
					throw new Error("Work items not initialized");
				}

				console.log("Skipping", action.payload);
			},
			setWorkItemLoading: (state, action: PayloadAction<string>) => {
				if (state.workItems === null) {
					throw new Error("Work items not initialized");
				}

				state.workItemLoading = action.payload;
			},
			clearWorkItemLoading: state => {
				state.workItemLoading = null;
			},
			updateWorkItemMatch: (state, action: PayloadAction<UpdateWorkItemMatchPayload>) => {
				if (state.workItems === null) {
					throw new Error("Work items not initialized");
				}

				const workItem = state.workItems[action.payload.id];

				if (workItem === undefined) {
					throw new Error(`Work item with ID ${action.payload.id} not found`);
				}

				state.workItemLoading = workItem.id;
				workItem.match = action.payload.match;
			},
			updateWorkItemMatchTrackID: (state, action: PayloadAction<UpdateWorkItemMatchTrackIDPayload>) => {
				if (state.workItems === null) {
					throw new Error("Work items not initialized");
				}

				const workItem = state.workItems[action.payload.id];

				if (workItem === undefined) {
					throw new Error(`Work item with ID ${action.payload.id} not found`);
				}

				if (workItem.match === null) {
					throw new Error("Work item match not initialized");
				}

				workItem.match.trackID = action.payload.trackID;
				workItem.match.type = action.payload.type;
			},
			clearWorkItemsMatch: state => {
				if (state.workItems === null) {
					throw new Error("Work items not initialized");
				}

				for (const workItem of Object.values(state.workItems)) {
					workItem.match = null;
				}
			},
			clearWorkItems: state => {
				state.workItems = null;
			},
			setSelected: (state, action: PayloadAction<WorkItemSelected>) => {
				state.selected = action.payload;
			},
			clearSelected: state => {
				state.selected = null;
			},
			setNowPlaying: (state, action: PayloadAction<string>) => {
				state.nowPlaying = action.payload;
			},
			clearNowPlaying: state => {
				state.nowPlaying = null;
			},
			toggleFilter: state => {
				state.filter = !state.filter;
			},
			toggleIsMatching: state => {
				state.isMatching = !state.isMatching;
			},
			startMatching: state => {
				state.isAdding = false;

				state.isMatching = true;
			},
			stopMatching: state => {
				state.isMatching = false;
				state.workItemLoading = null;
			},
			startAdding: state => {
				state.isMatching = false;

				state.isAdding = true;
			},
			stopAdding: state => {
				state.isAdding = false;
			},
			startClearing: state => {
				state.isClearing = true;
			},
			stopClearing: state => {
				state.isClearing = false;
			},
		},
	});
};

export type WorkItemsStore = ReturnType<typeof createWorkItemsStore>;

export interface UpdateWorkItemLoadingPayload extends IndexedDBRow {}

export interface UpdateWorkItemMatchPayload extends IndexedDBRow {
	match: WorkItemMatch;
}

export interface UpdateWorkItemMatchTrackIDPayload extends IndexedDBRow {
	trackID: string;
	type: WorkItemMatchType;
}

interface WorkItemsState {
	scanStatus: string | null;
	workItems: Record<string, WorkItem> | null;
	workItemLoading: string | null;
	selected: WorkItemSelected | null;
	nowPlaying: string | null;
	filter: boolean;
	isMatching: boolean;
	isAdding: boolean;
	isClearing: boolean;
}

export interface WorkItemSelected extends IndexedDBRow {
	type: "metadata" | "match" | "spotify";
}
