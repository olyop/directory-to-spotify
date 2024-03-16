import { createListenerMiddleware } from "@reduxjs/toolkit";

import type { AppDispatch, AppState, AppStores } from ".";
import { DatabaseManager } from "../database-manager";

export const storeDatabaseListener = createListenerMiddleware();

export const storeDatabaseListenerStart = storeDatabaseListener.startListening.withTypes<AppState, AppDispatch>();

export const createStoreDatabaseListeners = (stores: AppStores, databaseManager: DatabaseManager) => [
	storeDatabaseListenerStart({
		actionCreator: stores.workItemsStore.actions.addWorkItem,
		effect: async action => {
			await databaseManager.saveWorkItem(action.payload);
		},
	}),
	storeDatabaseListenerStart({
		actionCreator: stores.workItemsStore.actions.updateWorkItemMatch,
		effect: async (action, api) => {
			const { workItems } = api.getState().workItems;

			if (!workItems) return;

			const workItem = workItems[action.payload.id];

			if (!workItem) return;

			await databaseManager.saveWorkItem({
				...workItem,
				match: action.payload.match,
			});
		},
	}),
	storeDatabaseListenerStart({
		actionCreator: stores.workItemsStore.actions.clearWorkItems,
		effect: async () => {
			await databaseManager.clearWorkItems();
		},
	}),
	storeDatabaseListenerStart({
		actionCreator: stores.workItemsStore.actions.clearWorkItemsMatch,
		effect: async () => {
			await databaseManager.clearWorkItemsMatch();
		},
	}),
	storeDatabaseListenerStart({
		actionCreator: stores.workItemsStore.actions.updateWorkItemMatchTrackID,
		effect: async (action, api) => {
			const { workItems } = api.getState().workItems;

			if (!workItems) return;

			const workItem = workItems[action.payload.id];

			if (!workItem?.match) return;

			await databaseManager.saveWorkItem({
				...workItem,
				match: {
					...workItem.match,
					trackID: action.payload.trackID,
				},
			});
		},
	}),
];
