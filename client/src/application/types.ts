import { FileSystemReadDirectory, FileSystemReadFile, FileSystemReadItem } from "../packages/file-system-read";
import { IndexedDBRow } from "../types";

export interface WorkItem extends IndexedDBRow {
	path: string;
	metadata: WorkItemMetadata;
	match: WorkItemMatch | null;
}

export interface WorkItemMetadata {
	title: string | null;
	artist: string | null;
	album: string | null;
	albumArtist: string | null;
	genre: string | null;
	trackNumber: number | null;
	year: number | null;
	cover: string | null;
}

export interface WorkItemMatch extends WorkItemTrackID<string | null> {
	type: WorkItemMatchType;
	query: string;
	results: WorkItemResult[] | null;
}

export type WorkItemMatchType = "fuzzy" | "exact" | "manual";

export interface WorkItemResult extends WorkItemTrackID<string> {
	score: number | null;
}

export interface WorkItemFile extends IndexedDBRow {
	mimeType: string;
	data: ArrayBuffer;
}

export interface WorkItemFileExport extends IndexedDBRow {
	data: string;
}

export interface WorkItemTrackID<T> {
	trackID: T;
}

export interface FileSystemReadProperties {
	skip: boolean;
}

export type FileSystemReadItemCustom = FileSystemReadItem<FileSystemReadProperties>;
export type FileSystemReadFileCustom = FileSystemReadFile<FileSystemReadProperties>;
export type FileSystemReadDirectoryCustom = FileSystemReadDirectory<FileSystemReadProperties>;

export type OnReceivedFileWorkItem = (workItem: WorkItem, workItemFiles: WorkItemFile[]) => Promise<void>;
