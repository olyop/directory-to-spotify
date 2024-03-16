import { FC, PropsWithChildren, createElement, useEffect, useRef, useState } from "react";

import { DatabaseManager, DatabaseManagerOptions } from ".";
import { Loading } from "../../pages/loading";
import { DatabaseManagerContext } from "./context";

export const DatabaseManagerProvider: FC<PropsWithChildren> = ({ children }) => {
	const [isInitializing, setIsInitializing] = useState(true);

	const handleReady = () => {
		setIsInitializing(false);
	};

	const options: DatabaseManagerOptions = {
		onReady: handleReady,
	};

	const databaseManager = useRef(new DatabaseManager(options));

	useEffect(
		() => () => {
			setIsInitializing(true);
		},
		[],
	);

	if (isInitializing) return <Loading />;

	return <DatabaseManagerContext.Provider value={databaseManager.current}>{children}</DatabaseManagerContext.Provider>;
};
