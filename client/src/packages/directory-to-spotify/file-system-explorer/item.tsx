import { useHasMounted } from "hooks/use-has-mounted";
import { FC, useEffect, useState } from "react";

import { FileSystemExplorerItemExpandButton, FileSystemExplorerItemSkipButton } from "./buttons";
import { bytesFormatter } from "./bytes-formatter";
import { FileSystemExplorerContainer } from "./container";
import { determineFileSystemSelected, determineFileSystemSizeCustom } from "./helpers";
import { FileSystemExplorerItemProps } from "./props";

export const FileSystemExplorerItem: FC<FileSystemExplorerItemProps> = ({
	fileSystemItem,
	className,
	skipParent,
	onSkipUpdate,
}) => {
	const { path, children, configuration } = fileSystemItem;

	const hasChildren = children !== null;

	const hasMounted = useHasMounted();

	const [skip, setSkip] = useState(skipParent || configuration.skip);
	const [isExpanded, setIsExpanded] = useState(configuration.isExpanded);

	const [selected, setSelected] = useState(determineFileSystemSelected(fileSystemItem, skip));

	const [sizeFormatted, setSizeFormatted] = useState(
		bytesFormatter(determineFileSystemSizeCustom(fileSystemItem, skip)),
	);

	const handleExpand = () => {
		if (!hasChildren) {
			return;
		}

		setIsExpanded(prevState => {
			const newState = !prevState;

			// eslint-disable-next-line no-param-reassign
			configuration.isExpanded = newState;

			return newState;
		});
	};

	const handleSkipUpdate = (skipValue: boolean) => () => {
		const selectedNew = determineFileSystemSelected(fileSystemItem, skipValue);
		setSelected(selectedNew);

		const sizeNew = determineFileSystemSizeCustom(fileSystemItem, skipValue);
		setSizeFormatted(prevState => bytesFormatter(sizeNew, prevState));

		onSkipUpdate(selectedNew, sizeNew);
	};

	const handleSkip = () => {
		setSkip(prevState => {
			const newState = !prevState;

			// eslint-disable-next-line no-param-reassign
			configuration.skip = newState;

			return newState;
		});
	};

	useEffect(() => {
		if (hasMounted) {
			handleSkipUpdate(skip)();
		}
	}, [skip]);

	useEffect(() => {
		if (hasMounted) {
			setSkip(skipParent || configuration.skip);
		}
	}, [skipParent]);

	return (
		<FileSystemExplorerContainer className={className}>
			<div className="flex items-center gap-1">
				<FileSystemExplorerItemExpandButton
					path={path}
					skip={skip}
					isExpanded={isExpanded}
					fileSystemItem={fileSystemItem}
					onExpand={handleExpand}
					selected={selected}
					sizeFormatted={sizeFormatted}
				/>
				<FileSystemExplorerItemSkipButton
					path={path}
					skip={skip}
					onSkip={handleSkip}
					selected={selected}
					sizeFormatted={sizeFormatted}
				/>
			</div>
			{hasChildren && isExpanded && (
				<FileSystemExplorerInternal
					fileSystem={children}
					className="pl-10"
					onSkipUpdate={handleSkipUpdate(skip)}
					skip={skipParent || skip}
				/>
			)}
		</FileSystemExplorerContainer>
	);
};
