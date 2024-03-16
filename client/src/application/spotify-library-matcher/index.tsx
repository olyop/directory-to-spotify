import pLimit from "p-limit";
import { FC, createElement, useEffect, useMemo, useRef, useState } from "react";

import { Page } from "../../components/page";
import { useSpotify } from "../../packages/spotify-web-api-react";
import { useAppDispatch } from "../store";
import { useStores } from "../store/use-stores";
import { WorkItem } from "../types";
import { addToSavedLibrary } from "./adder";
import { AsideContent } from "./aside-content";
import { AsideHeader } from "./aside-header";
import { clearLibrary } from "./clear-library";
import { Controls } from "./controls";
import { matchWorkItem } from "./process-work-item";
import { SpotifyWebPlayer } from "./spotify-web-player";
import { WorkItemView } from "./work-item-view";

export const SpotifyLibraryMatcher: FC<SpotifyLibraryMatcherProps> = ({ onClear }) => {
	const stores = useStores();
	const { client } = useSpotify();
	const dispatch = useAppDispatch();

	const abortControllerRef = useRef(new AbortController());

	const [filter, setFilter] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	const handleMatchWorkItem = async (workItem: WorkItem) => {
		abortControllerRef.current.signal.throwIfAborted();

		const match = await matchWorkItem(client, workItem);

		dispatch(stores.workItemsStore.actions.updateWorkItemMatch({ id: workItem.id, match }));
	};

	const startMatching = async () => {
		abortControllerRef.current = new AbortController();

		const { workItems } = stores.rootStore.getState().workItems;

		if (workItems === null) throw new Error("Work items not found");

		const limit = pLimit(5);

		const workItemsInput = Object.values(workItems)
			.filter(workItem => workItem.match === null)
			.map(workItem => limit(() => handleMatchWorkItem(workItem)));

		try {
			await Promise.all(workItemsInput);
		} catch (error_) {
			if (error_ instanceof Error) {
				if (!error_.message.includes("Paused")) {
					setError(error_);
				}
			} else {
				setError(new Error("An unknown error occurred"));
			}
		} finally {
			dispatch(stores.workItemsStore.actions.stopMatching());
		}
	};

	const handleCancel = () => {
		abortControllerRef.current.abort();
		abortControllerRef.current = new AbortController();

		setError(null);

		onClear();
	};

	const handleFilterToggle = () => {
		setFilter(prevState => !prevState);
	};

	const handleToggleMatching = () => {
		const { isMatching } = stores.rootStore.getState().workItems;

		if (isMatching) {
			abortControllerRef.current.abort(new Error("Paused"));

			dispatch(stores.workItemsStore.actions.stopMatching());
		} else {
			dispatch(stores.workItemsStore.actions.startMatching());

			void startMatching();
		}
	};

	const startAdding = async () => {
		abortControllerRef.current = new AbortController();

		const { workItems } = stores.rootStore.getState().workItems;

		if (workItems === null) throw new Error("Work items not found");

		await addToSavedLibrary(client, Object.values(workItems), abortControllerRef.current.signal);

		dispatch(stores.workItemsStore.actions.stopAdding());
	};

	const handleToggleAdding = () => {
		const { isAdding } = stores.rootStore.getState().workItems;

		if (isAdding) {
			abortControllerRef.current.abort();

			dispatch(stores.workItemsStore.actions.stopAdding());
		} else {
			dispatch(stores.workItemsStore.actions.startAdding());

			void startAdding();
		}
	};

	const handleClearLibrary = () => {
		void clearLibrary(client);
	};

	// Cleanup
	useEffect(
		() => () => {
			abortControllerRef.current.abort();
			setError(null);
		},
		[],
	);

	const workItemsNode = useMemo(() => {
		const workItemsStore = Object.values(stores.rootStore.getState().workItems.workItems ?? {});

		let workItems;

		if (filter) {
			workItems = workItemsStore.filter(workItem => workItem.match?.trackID === null);
		} else {
			workItems = workItemsStore;
		}

		return workItems.map(workItem => <WorkItemView key={workItem.id} workItemID={workItem.id} />);
	}, [filter]);

	return (
		<Page
			contentNode={workItemsNode}
			menuNode={<SpotifyWebPlayer />}
			asideHeaderClassName="flex items-center gap-3"
			asideHeaderNode={<AsideHeader />}
			asideClassName="flex flex-col w-full h-full gap-6"
			asideNode={<AsideContent />}
			controlsClassName="flex items-center justify-between gap-4"
			controlsNode={
				<Controls
					filter={filter}
					error={error}
					onFilter={handleFilterToggle}
					onCancel={handleCancel}
					onToggleMatching={handleToggleMatching}
					onToggleAdding={handleToggleAdding}
					onClearLibrary={handleClearLibrary}
				/>
			}
		/>
	);
};

export interface SpotifyLibraryMatcherProps {
	onClear: () => void;
}
