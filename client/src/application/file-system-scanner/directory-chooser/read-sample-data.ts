import JSZip from "jszip";

import { WorkItem, WorkItemFile, WorkItemFileExport } from "../../types";

const SAMPLE_DATA_URL = "./sample-data.zip";

export const readSampleData = async () => {
	const zip = new JSZip();

	const response = await fetch(SAMPLE_DATA_URL);

	const data = await response.arrayBuffer();

	const unzipped = await zip.loadAsync(data);

	const workItemsJson = unzipped.file("work-items.json");
	const workItemFilesFolder = unzipped.folder("work-item-files");

	if (!workItemsJson || !workItemFilesFolder) {
		throw new Error("Invalid sample data");
	}

	const workItems = JSON.parse(await workItemsJson.async("string")) as WorkItem[];

	const workItemFiles: WorkItemFile[] = [];

	// filter files in the work-item-files folder
	const workItemFilesFolderFiles = Object.values(workItemFilesFolder.files).filter(
		file => !file.dir && file.name.startsWith("work-item-files") && file.name.endsWith(".json"),
	);

	for (const file of workItemFilesFolderFiles) {
		const workItemFileExport = JSON.parse(await file.async("string")) as WorkItemFileExport;

		// data:<mediatype>;base64,<data>

		const split = workItemFileExport.data.split(",");
		const head = split[0]; // data:<mediatype>;base64
		const base = split[1]; // <data>

		if (!head || !base) throw new Error("Invalid sample data");

		const headColonSplit = head.split(":");
		const info = headColonSplit[1]; // <mediatype>;base64

		if (!info) throw new Error("Invalid sample data");

		const infoSemiColonSplit = info.split(";");
		const mimeType = infoSemiColonSplit[0]; // <mediatype>

		if (!mimeType) throw new Error("Invalid sample data");

		workItemFiles.push({
			id: workItemFileExport.id,
			mimeType,
			data: base64ToArrayBuffer(base),
		});
	}

	return { workItems, workItemFiles };
};

function base64ToArrayBuffer(base64: string) {
	const binaryString = window.atob(base64);
	const { length } = binaryString;
	const bytes = new Uint8Array(length);

	for (let index = 0; index < length; index += 1) {
		// @ts-expect-error
		bytes[index] = binaryString.codePointAt(index);
	}

	return bytes.buffer;
}
