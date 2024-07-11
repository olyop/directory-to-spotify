import { ICommonTagsResult, parseBuffer as parseMetadata } from "music-metadata";

import { WorkItem, WorkItemFile, WorkItemMetadata } from "../../types";
import { MetadataScannerWorkerInput, MetadataScannerWorkerOutput } from "./types";

addEventListener("message", event => {
	void handleMessage(event);
});

const WORK_ITEMS_FILE_CACHE = new Map<string, string>();

async function handleMessage(event: DedicatedWorkerGlobalScopeEventMap["message"]) {
	try {
		const { path, data } = event.data as MetadataScannerWorkerInput;

		const musicMetadata = await parseMetadata(new Uint8Array(data));

		const { picture, ...common } = musicMetadata.common;

		const cover = await handleCover(picture);

		const metadata: WorkItemMetadata = {
			title: common.title ?? null,
			artist: common.artist ?? null,
			albumArtist: common.albumartist ?? null,
			album: common.album ?? null,
			genre: common.genre?.join(", ") ?? null,
			trackNumber: common.track.no ?? null,
			year: common.year ?? null,
			cover: cover ? (typeof cover === "string" ? cover : cover.id) : null,
		};

		const workItem: WorkItem = {
			id: crypto.randomUUID(),
			path,
			metadata,
			match: null,
		};

		const workItemFiles: WorkItemFile[] = [];

		if (cover && typeof cover !== "string") {
			workItemFiles.push(cover);
		}

		const response: MetadataScannerWorkerOutput = {
			workItem,
			workItemFiles,
		};

		postMessage(response);
	} catch (error) {
		postMessage({ error: error instanceof Error ? error.message : "Unknown error" });
	}
}

async function handleCover(
	pictures: Pick<ICommonTagsResult, "picture">["picture"],
): Promise<WorkItemFile | string | null> {
	if (pictures === undefined) return null;

	const picture = pictures[0];

	if (picture === undefined) return null;

	const { data, format: mimeType } = picture;

	const arrayBuffer = convertUint8Array(data);

	const [id, cached] = await arrayBufferCache(arrayBuffer);

	if (cached) {
		return id;
	}

	const workItemFile: WorkItemFile = {
		id,
		mimeType,
		data: arrayBuffer,
	};

	return workItemFile;
}

async function arrayBufferCache(arrayBuffer: ArrayBuffer) {
	let id: string;
	let cached: boolean;

	const shaHash = await crypto.subtle.digest("SHA-256", arrayBuffer);
	const shaHex = hex(shaHash);

	const cachedId = WORK_ITEMS_FILE_CACHE.get(shaHex);

	if (cachedId) {
		id = cachedId;
		cached = true;
	} else {
		id = crypto.randomUUID();
		WORK_ITEMS_FILE_CACHE.set(shaHex, id);
		cached = false;
	}

	return [id, cached] as const;
}

function convertUint8Array(buffer: Uint8Array): ArrayBuffer {
	const arrayBuffer = new ArrayBuffer(buffer.length);
	const view = new Uint8Array(arrayBuffer);

	view.set(buffer);

	return arrayBuffer;
}

const byteToHex: string[] = [];

for (let n = 0; n <= 0xff; n += 1) {
	const hexOctet = n.toString(16).padStart(2, "0");
	byteToHex.push(hexOctet);
}

function hex(arrayBuffer: ArrayBuffer) {
	const view = new Uint8Array(arrayBuffer);

	// eslint-disable-next-line unicorn/no-new-array
	const hexOctets = new Array<string>(view.length);

	// eslint-disable-next-line unicorn/no-for-loop
	for (let index = 0; index < view.length; index += 1) {
		// @ts-expect-error
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		hexOctets[index] = byteToHex[view[index]];
	}

	return hexOctets.join("");
}
