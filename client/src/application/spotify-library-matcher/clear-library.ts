import { Paging, Track } from "spotify-types";

import { SpotifyWebApiClient } from "../../packages/spotify-web-api";

export async function clearLibrary(client: SpotifyWebApiClient) {
	const library = await retrieveLibrary(client);

	await deleteLibrary(client, library);
}

async function retrieveLibrary(client: SpotifyWebApiClient) {
	const library: Track[] = [];

	let flag = true;
	let offset = 0;
	const limit = 50;

	while (flag) {
		const searchParams = new URLSearchParams();
		searchParams.append("limit", limit.toString());
		searchParams.append("offset", offset.toString());

		const response = await client.query<Paging<{ track: Track }>>("GET", "me/tracks", {
			searchParams,
		});

		console.log(response);

		library.push(...response.items.map(item => item.track));

		if (typeof response.next !== "string") {
			flag = false;
		}

		offset += limit;
	}

	return library;
}

async function deleteLibrary(client: SpotifyWebApiClient, library: Track[]) {
	const libraryBatched = library.reduce<string[][]>((batched, track, index) => {
		const batchIndex = Math.floor(index / 50);

		if (batched[batchIndex] === undefined) {
			// eslint-disable-next-line no-param-reassign
			batched[batchIndex] = [];
		}

		// @ts-expect-error
		batched[batchIndex].push(track.id);

		return batched;
	}, []);

	for (const batch of libraryBatched) {
		await client.query("DELETE", "me/tracks", {
			body: {
				ids: batch,
			},
		});
	}
}
