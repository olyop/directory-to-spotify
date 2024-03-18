import Fuse from "fuse.js";
import { Paging, Track } from "spotify-types";

import { SpotifyWebApiClient } from "../../../packages/spotify-web-api";
import { IndexedDBRow } from "../../../types";
import { WorkItem, WorkItemMatch, WorkItemResult } from "../../types";

Fuse.config.includeScore = true;
Fuse.config.ignoreLocation = true;
Fuse.config.isCaseSensitive = false;
Fuse.config.keys = ["value"];

export async function matchWorkItem(spotify: SpotifyWebApiClient, workItem: WorkItem): Promise<WorkItemMatch> {
	const query = createSearchQuery(workItem);

	const tracks = await search(spotify, query);

	const exactMatch = handleExactMatch(workItem, query, tracks);

	if (exactMatch.trackID !== null) {
		return exactMatch;
	}

	return handleFuzzyMatch(workItem, query, tracks);
}

function createSearchQuery(workItem: WorkItem) {
	return `${prepareString(workItem.metadata.title)} ${prepareString(workItem.metadata.artist)}`;
}

async function search(client: SpotifyWebApiClient, query: string) {
	const searchParams = new URLSearchParams();
	searchParams.append("type", "track");
	searchParams.append("q", query);

	const response = await client.query<SearchResponse>("GET", "search", {
		searchParams,
		cache: true,
	});

	return response.tracks.items;
}

function handleExactMatch(workItem: WorkItem, query: string, tracks: Track[]) {
	let trackID: string | null = null;

	for (const track of tracks) {
		if (
			prepareString(workItem.metadata.title) === prepareString(track.name) &&
			prepareString(workItem.metadata.artist) === track.artists.map(({ name }) => prepareString(name)).join(" ")
		) {
			trackID = track.id;
			break;
		}
	}

	const results = tracks.map<WorkItemResult>(({ id }) => ({
		score: null,
		trackID: id,
	}));

	const match: WorkItemMatch = {
		type: "exact",
		query,
		results,
		trackID,
	};

	return match;
}

function handleFuzzyMatch(workItem: WorkItem, query: string, tracks: Track[]) {
	const fuzzyQuery = createFuzzyMatchString(workItem.metadata.title, [workItem.metadata.artist]);

	const fuzzList = tracks.map<FuzzyMatchRecord>(track => ({
		id: track.id,
		value: createFuzzyMatchString(
			track.name,
			track.artists.map(({ name }) => name),
		),
	}));

	const fuse = new Fuse(fuzzList);

	const fuseResults = fuse.search(fuzzyQuery);

	let bestFuzzScore = 1; // 1 is the worst score
	let trackID: string | null = null;
	let results: WorkItemResult[] | null = null;

	for (const fuzzResult of fuseResults) {
		const score = fuzzResult.score ?? 1;

		if (score <= 0.6 && score <= bestFuzzScore) {
			bestFuzzScore = score;
			trackID = fuzzResult.item.id;
		}

		if (results === null) {
			results = [];
		}

		results.push({
			trackID: fuzzResult.item.id,
			score,
		});
	}

	const match: WorkItemMatch = {
		type: "fuzzy",
		query,
		results,
		trackID,
	};

	return match;
}

function createFuzzyMatchString(title: MatchValue, artists: MatchValue[]) {
	return `${prepareString(title)} ${artists.map(prepareString).join(", ")}`;
}

function prepareString(value: MatchValue) {
	return removeDoubleWhiteSpace(removeSymbols(removeBlackListedWords(toLower(value))));
}

function toLower(value: MatchValue) {
	return value?.toLowerCase() ?? "";
}

const blackListedWords = new Set(["feat.", "feat", "&", "ft.", "featuring", "with", "extended mix", "remastered"]);

function removeBlackListedWords(value: string) {
	return value
		.split(" ")
		.filter(word => !blackListedWords.has(word))
		.join(" ")
		.trim();
}

function removeSymbols(value: string) {
	// eslint-disable-next-line unicorn/better-regex, no-useless-escape
	return value.replaceAll(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g, "");
}

function removeDoubleWhiteSpace(value: string) {
	return value.replaceAll(/\s\s+/g, " ").trim();
}

type MatchValue = string | null | undefined;

interface FuzzyMatchRecord extends IndexedDBRow {
	value: string;
}

interface SearchResponse {
	tracks: Paging<Track>;
}
