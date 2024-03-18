import { FC, createElement, useEffect, useMemo, useState } from "react";

import { Page } from "../../components/page";
import { useStores } from "../store/use-stores";
import { AsideContent } from "./aside-content";
import { AsideHeader } from "./aside-header";
import { Controls } from "./controls";
import { SpotifyWebPlayer } from "./spotify-web-player";
import { WorkItemView } from "./work-item-view";

export const SpotifyLibraryMatcher: FC<SpotifyLibraryMatcherProps> = ({ onClear }) => {
	const stores = useStores();

	const [filter, setFilter] = useState(false);

	const handleCancel = () => {
		onClear();
	};

	const handleFilterToggle = () => {
		setFilter(prevState => !prevState);
	};

	// Cleanup
	useEffect(
		() => () => {
			setFilter(false);
		},
		[],
	);

	const workItemsNode = useMemo(() => {
		const { workItems } = stores.rootStore.getState().workItems;

		if (!workItems) {
			return null;
		}

		const workItemsStore = Object.values(workItems);

		let value;

		if (filter) {
			value = workItemsStore.filter(workItem => workItem.match?.trackID === null);
		} else {
			value = workItemsStore;
		}

		return value.map(workItem => <WorkItemView key={workItem.id} workItemID={workItem.id} />);
	}, [filter]);

	const spotifyWebPlayerNode = useMemo(() => <SpotifyWebPlayer />, []);
	const asideHeaderNode = useMemo(() => <AsideHeader />, []);
	const asideContentNode = useMemo(() => <AsideContent />, []);

	return (
		<Page
			menuNode={spotifyWebPlayerNode}
			contentNode={workItemsNode}
			asideHeaderNode={asideHeaderNode}
			asideNode={asideContentNode}
			controlsNode={<Controls filter={filter} onFilterToggle={handleFilterToggle} onCancel={handleCancel} />}
			asideHeaderClassName="flex items-center gap-3"
			asideClassName="flex flex-col w-full h-full gap-6"
			controlsClassName="grid grid-cols-2 gap-8"
		/>
	);
};

export interface SpotifyLibraryMatcherProps {
	onClear: () => void;
}
