import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";

import { WorkItem, WorkItemFile } from "../types";
import { storeDatabaseListener } from "./database-listener";
// eslint-disable-next-line import/no-cycle
import { createWorkItemsStore } from "./work-items-store";

export const createStores = (options: CreateStoreOptions) => {
	const workItemsStore = createWorkItemsStore(options);

	const rootStore = configureStore({
		reducer: {
			workItems: workItemsStore.reducer,
		},
		middleware: getDefaultMiddleware => getDefaultMiddleware().prepend(storeDatabaseListener.middleware),
	});

	return {
		rootStore,
		workItemsStore,
	};
};

export interface CreateStoreOptions {
	workItems: Record<string, WorkItem> | null;
	workItemFiles: Record<string, WorkItemFile> | null;
}

export type AppStores = ReturnType<typeof createStores>;
export type AppStore = AppStores["rootStore"];
export type AppState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<AppState>();
