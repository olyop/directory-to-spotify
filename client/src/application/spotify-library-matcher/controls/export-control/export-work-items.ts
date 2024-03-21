import { WorkItem, WorkItemFile } from "../../../types";
import convertWorkItemFilesWorker from "./export-work-item-worker?worker&url";

export async function exportWorkItems(
	workItems: Record<string, WorkItem>,
	workItemFiles: Record<string, WorkItemFile>,
) {
	const worker = new Worker(convertWorkItemFilesWorker, {
		type: "module",
		name: "export-work-item-worker",
	});

	try {
		const transferables: Transferable[] = Object.values(workItemFiles).map(({ data }) => data);

		const response = await processWorkerResponse<ArrayBuffer>(worker, { workItems, workItemFiles }, transferables);

		downloadFile(response, "work-items.zip");
	} finally {
		worker.terminate();
	}
}

async function processWorkerResponse<Output>(worker: Worker, input: unknown, transferables: Transferable[]) {
	return new Promise<Output>((resolve, reject) => {
		worker.addEventListener("error", event => {
			reject(new Error(event.message));
		});

		worker.addEventListener("message", event => {
			resolve(event.data as Output);
		});

		worker.postMessage(input, transferables);
	});
}

function downloadFile(data: ArrayBuffer, filename: string) {
	const blob = new Blob([data], { type: "application/json" });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	a.click();
	URL.revokeObjectURL(url);
	a.remove();
}
