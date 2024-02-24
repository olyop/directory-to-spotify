import { memo } from "react";

import { FileSystemExplorerInternal } from "./internal";
import { FileSystemExplorerProps } from "./props";

export * from "./props";
export * from "./types";
export * from "./bytes-formatter";

export const FileSystemExplorer = memo<FileSystemExplorerProps>(({ fileSystem, onSkipUpdate, className }) => (
	<FileSystemExplorerInternal
		fileSystem={fileSystem}
		className={className}
		onSkipUpdate={onSkipUpdate}
		configuration={{
			skip: false,
			isExpanded: true,
		}}
	/>
));
