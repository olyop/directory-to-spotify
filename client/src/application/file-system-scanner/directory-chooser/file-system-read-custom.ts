import {
	FileSystemReadIgnoreFunction,
	FileSystemReadOnDirectoryChosenFunction,
	FileSystemReadSelectedFunction,
	fileSystemRead,
} from "../../../packages/file-system-read";
import { FileSystemReadProperties } from "../../types";

const ignoredDirectories = new Set([
	".git",
	"node_modules",
	"dist",
	"build",
	"out",
	"target",
	".next",
	".vscode",
	".idea",
]);

const fileSystemReadIgnore: FileSystemReadIgnoreFunction<FileSystemReadProperties> = ({ handle, isRoot }) => {
	if (!isRoot && ignoredDirectories.has(handle.name)) {
		return true;
	}

	return false;
};

const maxFileSize = 50 * 1024 * 1024; // 50 MB

const acceptedMimeTypes = new Set([
	"audio/aiff",
	"audio/aiffc",
	"audio/x-aiff",
	"audio/x-aiffc",
	"audio/aac",
	"audio/aacp",
	"audio/x-aac",
	"audio/ape",
	"audio/x-ape",
	"audio/x-monkeys-audio",
	"video/x-ms-asf",
	"audio/x-bwf",
	"audio/x-dsd",
	"audio/dsd",
	"audio/x-dsdiff",
	"audio/x-dsf",
	"audio/flac",
	"audio/x-flac",
	"audio/mp2",
	"audio/mpeg",
	"audio/x-mpeg",
	"audio/matroska",
	"audio/x-matroska",
	"audio/mp3",
	"audio/x-mp3",
	"audio/mpc",
	"audio/musepack",
	"audio/x-musepack",
	"audio/mp4",
	"audio/mpeg4-generic",
	"audio/mpeg4-generic",
	"audio/ogg",
	"audio/x-ogg",
	"audio/opus",
	"audio/speex",
	"audio/theora",
	"audio/x-vorbis",
	"audio/vnd.wave",
	"audio/wav",
	"audio/x-wav",
	"video/webm",
	"audio/webm",
	"audio/x-webm",
	"audio/x-wavpack",
	"audio/x-wma",
	"audio/x-ms-wma",
]);

const fileSystemReadSelected: FileSystemReadSelectedFunction<FileSystemReadProperties> = ({ file }) => {
	let value = true;

	if (file) {
		if (file.size > maxFileSize) {
			value = false;
		}

		if (!acceptedMimeTypes.has(file.type)) {
			value = false;
		}
	}

	return value;
};

export const fileSystemReadCustom = (
	signal: AbortSignal | undefined,
	onDirectoryChosen: FileSystemReadOnDirectoryChosenFunction,
) =>
	fileSystemRead<FileSystemReadProperties>({
		signal,
		onDirectoryChosen,
		ignore: fileSystemReadIgnore,
		selected: fileSystemReadSelected,
	});
