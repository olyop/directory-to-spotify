import { WorkItem, WorkItemFile } from "../../types";

export interface MetadataScannerWorkerInput {
	path: string;
	format: string;
	data: ArrayBuffer;
}

export type MetadataScannerWorkerOutput = MetadataScannerWorkerOutputSuccess | MetadataScannerWorkerOutputFailure;

interface MetadataScannerWorkerOutputSuccess {
	workItem: WorkItem;
	workItemFiles: WorkItemFile[];
}

interface MetadataScannerWorkerOutputFailure {
	error: string;
}
