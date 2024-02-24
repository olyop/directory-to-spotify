import { memo } from "react";

import { FileSystemExplorerContainer } from "./container";
import { FileSystemExplorerItem } from "./item";
import { FileSystemExplorerInternalProps } from "./props";

export const FileSystemExplorerInternal = memo<FileSystemExplorerInternalProps>(
	({ fileSystem, className, onSkipUpdate }) => (
		<FileSystemExplorerContainer className={className}>
			{fileSystem.map(fileSystemItem => (
				<FileSystemExplorerItem
					key={fileSystemItem.path}
					fileSystemItem={fileSystemItem}
					fileSystemItemParent={fileSystem}
					onSkipUpdate={onSkipUpdate}
					renderChildren={({ onSkipUpdate }) => (
						<FileSystemExplorerInternal
							fileSystem={children}
							className="pl-10"
							onSkipUpdate={handleSkipUpdate(skip)}
							skip={skipParent || skip}
						/>
					)}
				/>
			))}
		</FileSystemExplorerContainer>
	),
);
