import { ArrowPathIcon, ChevronDoubleRightIcon, PlusIcon } from "@heroicons/react/24/outline";
import { FC, createElement, useEffect, useRef } from "react";

import { Button } from "../../../components/button";
import { useSpotify } from "../../../packages/spotify-web-api-react";
import { useAppDispatch } from "../../store";
import { useStores } from "../../store/use-stores";
import { addWorkItemsToSpotify } from "./add-work-items-to-spotify";

export const AddToSpotifyControl: FC<AddToSpotifyControlProps> = ({ isAdding }) => {
	const stores = useStores();
	const { client } = useSpotify();
	const dispatch = useAppDispatch();

	const abortControllerRef = useRef(new AbortController());

	const handleStartAdding = async () => {
		abortControllerRef.current = new AbortController();

		const { workItems } = stores.rootStore.getState().workItems;

		if (workItems === null) throw new Error("Work items not found");

		dispatch(stores.workItemsStore.actions.startAdding());

		try {
			await addWorkItemsToSpotify(client, abortControllerRef.current.signal, workItems);
		} finally {
			dispatch(stores.workItemsStore.actions.stopAdding());
		}
	};

	const handleClick = () => {
		if (isAdding) {
			abortControllerRef.current.abort(new Error("Stopped"));

			dispatch(stores.workItemsStore.actions.stopAdding());
		} else {
			void handleStartAdding();
		}
	};

	useEffect(
		() => () => {
			abortControllerRef.current.abort();
		},
		[],
	);

	return (
		<Button
			onClick={handleClick}
			className="w-54 h-14 justify-between"
			text={isAdding ? "Stop adding" : "Start adding"}
			ariaLabel={isAdding ? "Pause adding" : "Start adding"}
			leftIcon={className => <PlusIcon className={className} />}
			rightIcon={className =>
				isAdding ? (
					<ArrowPathIcon className={`animate-spin ${className}`} />
				) : (
					<ChevronDoubleRightIcon className={className} />
				)
			}
		/>
	);
};

export interface AddToSpotifyControlProps {
	isAdding: boolean;
}
