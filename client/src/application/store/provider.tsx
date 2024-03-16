import { FC, PropsWithChildren, createElement, useEffect, useState } from "react";
import { Provider as ReactReduxProvider } from "react-redux";

import { AppStores, CreateStoreOptions, createStores } from ".";
import { Loading } from "../../pages/loading";
import { useDatabaseManager } from "../database-manager/use-database-manager";
import { createStoreDatabaseListeners } from "./database-listener";
import { StoresContext } from "./stores-context";

export const ReduxStoresProvider: FC<PropsWithChildren> = ({ children }) => {
	const databaseManager = useDatabaseManager();

	const [isInitializing, setIsInitializing] = useState(true);
	const [stores, setStores] = useState<AppStores | null>(null);

	const initializeStore = async () => {
		const options: CreateStoreOptions = {
			workItems: await databaseManager.retrieveWorkItems(),
			workItemFiles: await databaseManager.retrieveWorkItemFiles(),
		};

		setStores(createStores(options));
	};

	useEffect(() => {
		if (!stores) return;

		const unsubscribes = createStoreDatabaseListeners(stores, databaseManager);

		setIsInitializing(false);

		// eslint-disable-next-line consistent-return
		return () => {
			unsubscribes.forEach(unsubscribe => {
				unsubscribe();
			});
		};
	}, [stores]);

	useEffect(() => {
		if (stores) return;

		void initializeStore();

		// eslint-disable-next-line consistent-return
		return () => {
			setIsInitializing(true);
		};
	}, []);

	if (isInitializing || !stores) return <Loading text="Initializing" />;

	return (
		<ReactReduxProvider store={stores.rootStore}>
			<StoresContext.Provider value={stores}>{children}</StoresContext.Provider>
		</ReactReduxProvider>
	);
};
