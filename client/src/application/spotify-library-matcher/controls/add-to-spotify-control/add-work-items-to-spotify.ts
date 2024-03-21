import pLimit from "p-limit";

import { SpotifyWebApiClient } from "../../../../packages/spotify-web-api";
import { WorkItem } from "../../../types";

export async function addWorkItemsToSpotify(
	client: SpotifyWebApiClient,
	signal: AbortSignal,
	workItems: Record<string, WorkItem>,
) {
	const trackIDsBatched = workItemsToBatchedTrackIDs(workItems);

	const awaitableBatches = handleTrackIDBatches(client, signal, trackIDsBatched);

	await Promise.all(awaitableBatches);
}

function workItemsToBatchedTrackIDs(workItems: Record<string, WorkItem>) {
	return Object.values(workItems).reduce<Batches>((batched, workItem, index) => {
		if (!workItem.match?.trackID) return batched;

		const batchIndex = Math.floor(index / 50);

		if (!batched[batchIndex]) {
			// eslint-disable-next-line no-param-reassign
			batched[batchIndex] = [];
		}

		// @ts-expect-error
		batched[batchIndex].push(workItem.match.trackID);

		return batched;
	}, []);
}

function handleTrackIDBatches(client: SpotifyWebApiClient, signal: AbortSignal, batches: Batches) {
	const limit = pLimit(5);

	return batches.map(batch => limit(() => handleTrackIDBatch(client, signal, batch)));
}

function handleTrackIDBatch(client: SpotifyWebApiClient, signal: AbortSignal, batch: Batch) {
	signal.throwIfAborted();

	return addTrackIDBatchToSpotify(client, batch);
}

function addTrackIDBatchToSpotify(client: SpotifyWebApiClient, batch: Batch) {
	return client.query("PUT", "me/tracks", {
		body: {
			ids: batch,
		},
	});
}

type Batch = string[];
type Batches = Batch[];
