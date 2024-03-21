import { ArrowDownTrayIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import { FC, createElement, useState } from "react";

import { Button } from "../../../../components/button";
import { useDatabaseManager } from "../../../database-manager/use-database-manager";
import { useStores } from "../../../store/use-stores";
import { exportWorkItems } from "./export-work-items";

export const ExportControl: FC<ExportControlProps> = () => {
	const stores = useStores();
	const databaseManager = useDatabaseManager();

	const [loading, setLoading] = useState(false);

	const exportData = async () => {
		setLoading(true);

		try {
			const { workItems } = stores.rootStore.getState().workItems;
			const workItemFiles = await databaseManager.retrieveWorkItemFiles();

			if (!workItems || !workItemFiles) return;

			await exportWorkItems(workItems, workItemFiles);
		} finally {
			setLoading(false);
		}
	};

	const handleClick = () => {
		void exportData();
	};

	return (
		<Button
			transparent
			onClick={handleClick}
			className="h-14 justify-between"
			text={loading ? "Exporting..." : "Export"}
			ariaLabel={loading ? "Exporting..." : "Export"}
			leftIcon={className =>
				loading ? (
					<ArrowPathIcon className={`animate-spin ${className}`} />
				) : (
					<ArrowDownTrayIcon className={className} />
				)
			}
		/>
	);
};

export interface ExportControlProps {}
