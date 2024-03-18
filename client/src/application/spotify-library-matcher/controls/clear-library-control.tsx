import { ArrowPathIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { FC, createElement, useEffect, useRef } from "react";

import { Button } from "../../../components/button";
import { useSpotify } from "../../../packages/spotify-web-api-react";
import { useAppDispatch } from "../../store";
import { useStores } from "../../store/use-stores";
import { clearLibrary } from "./clear-library";

export const ClearLibraryControl: FC<ClearLibraryControlProps> = ({ isClearing }) => {
	const stores = useStores();
	const { client } = useSpotify();
	const dispatch = useAppDispatch();

	const abortControllerRef = useRef(new AbortController());

	const handleClearLibrary = async () => {
		abortControllerRef.current = new AbortController();

		dispatch(stores.workItemsStore.actions.startClearing());

		try {
			await clearLibrary(client, abortControllerRef.current.signal);
		} finally {
			dispatch(stores.workItemsStore.actions.stopClearing());
		}
	};

	const handleClick = () => {
		if (isClearing) {
			abortControllerRef.current.abort(new Error("Stopped"));

			dispatch(stores.workItemsStore.actions.stopClearing());
		} else {
			void handleClearLibrary();
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
			transparent
			text="Clear library"
			ariaLabel="Clear library"
			onClick={handleClick}
			className="w-54 h-14 justify-between"
			leftIcon={className =>
				isClearing ? <ArrowPathIcon className={`animate-spin ${className}`} /> : <XMarkIcon className={className} />
			}
		/>
	);
};

export interface ClearLibraryControlProps {
	isClearing: boolean;
}
