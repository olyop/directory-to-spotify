/* eslint-disable unicorn/prefer-string-replace-all */

const sizes = ["Bytes", "KB", "MB", "GB", "TB"];

export const bytesFormatter = (bytes: number, previousBytesFormatted?: string) => {
	if (bytes === 0 && previousBytesFormatted && previousBytesFormatted.length > 0) {
		const previousBytesFormattedSplit = previousBytesFormatted.split(" ");

		const left = previousBytesFormattedSplit[0];
		const right = previousBytesFormattedSplit[1];

		if (left !== undefined && right !== undefined) {
			return `${left.replaceAll(/\d/g, "0")} ${right}`;
		}
	}

	const index = Math.floor(Math.log(bytes) / Math.log(1024));

	if (index === 0) {
		return `${bytes} ${sizes[index]}`;
	}

	return `${(bytes / 1024 ** index).toFixed(1)} ${sizes[index]}`;
};
