import { SpotifyWebApiClient } from "../../packages/spotify-web-api";
import { WorkItem } from "../types";

export async function addToSavedLibrary(client: SpotifyWebApiClient, workItems: WorkItem[], signal: AbortSignal) {
	const trackIDsBatched = workItems.reduce<string[][]>((batched, workItem, index) => {
		const batchIndex = Math.floor(index / 50);

		if (workItem.match === null) return batched;
		if (workItem.match.trackID === null) return batched;

		if (batched[batchIndex] === undefined) {
			// eslint-disable-next-line no-param-reassign
			batched[batchIndex] = [];
		}

		// @ts-expect-error
		batched[batchIndex].push(workItem.match.trackID);

		return batched;
	}, []);

	for (const batch of trackIDsBatched) {
		if (signal.aborted) throw new Error("Aborted");

		await client.query("PUT", "me/tracks", {
			body: {
				ids: batch,
			},
		});
	}
}
