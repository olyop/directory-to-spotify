import { XMarkIcon } from "@heroicons/react/24/outline";
import { FC, createElement, useEffect, useRef } from "react";

import { Button } from "../../../components/button";
import { Loading } from "../../../pages/loading";
import { useDatabaseManager } from "../../database-manager/use-database-manager";
import { useAppDispatch } from "../../store";
import { useStores } from "../../store/use-stores";
import { FileSystemReadDirectoryCustom, WorkItem, WorkItemFile } from "../../types";
import { processFileSystem } from "./process-file-system";
import { ScanningStatus } from "./status";

export const FileSystemScanning: FC<FileSystemScannerProps> = ({ fileSystem, onCancel, onScanComplete }) => {
	const stores = useStores();
	const dispatch = useAppDispatch();
	const databaseManager = useDatabaseManager();

	const abortControllerRef = useRef<AbortController>(new AbortController());

	const handleWorkItem = async (workItem: WorkItem, workItemFiles: WorkItemFile[]) => {
		await databaseManager.saveWorkItemFiles(workItemFiles);

		dispatch(stores.workItemsStore.actions.addWorkItem(workItem));
	};

	const handleScan = async () => {
		try {
			abortControllerRef.current = new AbortController();

			await processFileSystem({
				fileSystemItem: fileSystem,
				onWorkItem: handleWorkItem,
				signal: abortControllerRef.current.signal,
			});

			onScanComplete();
		} catch (error) {
			if (error instanceof Error) {
				if (error.message.includes("Cancelled")) {
					dispatch(stores.workItemsStore.actions.clearWorkItems());

					onCancel();
				}
			} else {
				throw new TypeError("Unknown error");
			}
		} finally {
			dispatch(stores.workItemsStore.actions.clearStatus());
		}
	};

	const handleScanCancel = () => {
		abortControllerRef.current.abort(new Error("Cancelled"));
	};

	useEffect(() => {
		void handleScan();

		return () => {
			abortControllerRef.current.abort();
		};
	}, []);

	return (
		<Loading
			text={<ScanningStatus />}
			controlsNode={
				<Button
					transparent
					text="Cancel"
					ariaLabel="Cancel"
					onClick={handleScanCancel}
					leftIcon={className => <XMarkIcon className={className} />}
				/>
			}
		/>
	);
};

export interface FileSystemScannerProps {
	fileSystem: FileSystemReadDirectoryCustom;
	onCancel: () => void;
	onScanComplete: () => void;
}
