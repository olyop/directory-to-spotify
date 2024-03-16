import { FC, createElement, useRef, useState } from "react";

import { FileSystemScanner } from "./file-system-scanner";
import { SpotifyLibraryMatcher } from "./spotify-library-matcher";
import { useStores } from "./store/use-stores";

export const DirectoryToSpotify: FC = () => {
	const stores = useStores();

	const initialIsMatch = useRef(stores.rootStore.getState().workItems.workItems !== null);

	const [isMatcher, setIsMatcher] = useState(initialIsMatch.current);

	const handleScanComplete = () => {
		setIsMatcher(true);
	};

	const handleClear = () => {
		setIsMatcher(false);
	};

	return isMatcher ? (
		<SpotifyLibraryMatcher onClear={handleClear} />
	) : (
		<FileSystemScanner onScanComplete={handleScanComplete} />
	);
};
