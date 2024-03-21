import JSZip from "jszip";

import { WorkItem, WorkItemFile, WorkItemFileExport } from "../../../types";

addEventListener("message", event => {
	void handleMessage(event);
});

async function handleMessage(event: DedicatedWorkerGlobalScopeEventMap["message"]) {
	const { workItems, workItemFiles } = event.data as ConvertWorkItemFilesInput;

	const workItemsArray = convertWorkItems(workItems);
	const workItemFilesArray = convertWorkItemFiles(workItemFiles);

	const zip = new JSZip();

	zip.file("work-items.json", JSON.stringify(workItemsArray));

	zip.folder("work-item-files");

	workItemFilesArray.forEach(workItemFile => {
		zip.file(`work-item-files/${workItemFile.id}.json`, JSON.stringify(workItemFile));
	});

	const data = await zip.generateAsync({ type: "arraybuffer" });

	postMessage(data, [data]);
}

function convertWorkItems(workItems: Record<string, WorkItem>) {
	return Object.values(workItems).map<WorkItem>(({ match, ...workItem }) => ({
		...workItem,
		match: null,
	}));
}

function convertWorkItemFiles(workItemFiles: Record<string, WorkItemFile>) {
	return Object.values(workItemFiles).map<WorkItemFileExport>(({ id, mimeType, data }) => ({
		id,
		data: convertArrayBufferToDataUrl(data, mimeType),
	}));
}

function convertArrayBufferToDataUrl(buffer: ArrayBuffer, mimeType: string) {
	return `data:${mimeType};base64,${convertArrayBufferToBase64(buffer)}`;
}

function convertArrayBufferToBase64(buffer: ArrayBuffer) {
	let binary = "";

	const bytes = new Uint8Array(buffer);

	for (let index = 0; index < bytes.byteLength; index += 1) {
		// @ts-expect-error
		binary += String.fromCodePoint(bytes[index]);
	}

	return btoa(binary);
}

export interface ConvertWorkItemFilesInput {
	workItems: Record<string, WorkItem>;
	workItemFiles: Record<string, WorkItemFile>;
}
