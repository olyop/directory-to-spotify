import { ArrowPathIcon, ChevronDoubleRightIcon, PauseIcon, PlayIcon } from "@heroicons/react/24/outline";
import pLimit from "p-limit";
import { FC, createElement, useRef } from "react";

import { Button } from "../../../../components/button";
import { useSpotify } from "../../../../packages/spotify-web-api-react";
import { useAppDispatch } from "../../../store";
import { useStores } from "../../../store/use-stores";
import { WorkItem } from "../../../types";
import { matchWorkItem } from "./match-work-items";

export const MatchingControl: FC<MatchingControlProps> = ({ isMatching, matched, total }) => {
	const stores = useStores();
	const { client } = useSpotify();
	const dispatch = useAppDispatch();

	const abortControllerRef = useRef(new AbortController());

	const handleMatchWorkItem = async (workItem: WorkItem) => {
		abortControllerRef.current.signal.throwIfAborted();

		const match = await matchWorkItem(client, workItem);

		dispatch(stores.workItemsStore.actions.updateWorkItemMatch({ id: workItem.id, match }));
	};

	const startMatching = async () => {
		abortControllerRef.current = new AbortController();

		const { workItems } = stores.rootStore.getState().workItems;

		if (workItems === null) throw new Error("Work items not found");

		dispatch(stores.workItemsStore.actions.startMatching());

		const limit = pLimit(5);

		const workItemsInput = Object.values(workItems)
			.filter(workItem => workItem.match === null)
			.map(workItem => limit(() => handleMatchWorkItem(workItem)));

		try {
			await Promise.all(workItemsInput);
		} finally {
			dispatch(stores.workItemsStore.actions.stopMatching());
		}
	};

	const handleToggleMatching = () => {
		if (isMatching) {
			abortControllerRef.current.abort(new Error("Paused"));

			dispatch(stores.workItemsStore.actions.stopMatching());
		} else {
			void startMatching();
		}
	};

	return (
		<Button
			onClick={handleToggleMatching}
			className="h-14 w-48 justify-between"
			text={
				<div className="flex flex-col">
					<span>{isMatching ? "Pause" : "Start"}</span>
					<span className="font-mono text-xs">
						{matched}/{total}
					</span>
				</div>
			}
			ariaLabel={isMatching ? "Pause matching" : "Start matching"}
			leftIcon={className => (isMatching ? <PauseIcon className={className} /> : <PlayIcon className={className} />)}
			rightIcon={className =>
				isMatching ? (
					<ArrowPathIcon className={`animate-spin ${className}`} />
				) : (
					<ChevronDoubleRightIcon className={className} />
				)
			}
		/>
	);
};

export interface MatchingControlProps {
	isMatching: boolean;
	matched: number;
	total: number;
}
