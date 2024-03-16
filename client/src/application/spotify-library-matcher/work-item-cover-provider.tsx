import { FC, ReactElement, useEffect, useState } from "react";

import { useDatabaseManager } from "../database-manager/use-database-manager";
import { WorkItemInternal } from "./work-item-view/types";

const cache = new Map<string, string>();

export const WorkItemCoverProvider: FC<WorkItemViewMetadataItemProps> = ({ workItem, children }) => {
	const databaseManager = useDatabaseManager();

	const [coverURL, setCoverURL] = useState<string | null>(null);

	const handleCoverURL = async () => {
		if (!workItem.metadata.cover) return;

		const workItemFile = await databaseManager.retrieveWorkItemFile(workItem.metadata.cover);

		if (!workItemFile) throw new Error("Work item file not found");

		let value: string;

		if (cache.has(workItemFile.id)) {
			value = cache.get(workItemFile.id) as string;
		} else {
			const blob = new Blob([workItemFile.data], { type: workItemFile.mimeType });
			const url = URL.createObjectURL(blob);
			cache.set(workItemFile.id, url);
			value = url;
		}

		setCoverURL(value);
	};

	useEffect(() => {
		void handleCoverURL();
	}, [workItem.metadata.cover]);

	return children(coverURL);
};

export interface WorkItemViewMetadataItemProps {
	workItem: WorkItemInternal;
	children: (coverURL: string | null) => ReactElement;
}
