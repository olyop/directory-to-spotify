import { TrashIcon } from "@heroicons/react/24/outline";
import { FC, createElement } from "react";

import { Button } from "../../../../components/button";
import { useAppDispatch } from "../../../store";
import { useWorkItemInternalSelector } from "../../../store/selectors";
import { useStores } from "../../../store/use-stores";
import { WorkItemCoverProvider } from "../../work-item-cover-provider";
import { TrackContent } from "../track-content";

export const AsideLocalFileContent: FC<AsideLocalFileContentProps> = ({ id }) => {
	const stores = useStores();
	const dispatch = useAppDispatch();

	const workItem = useWorkItemInternalSelector(id);

	const handleDeleteClick = () => {
		dispatch(stores.workItemsStore.actions.skipWorkItem(id));
	};

	return (
		<WorkItemCoverProvider workItem={workItem}>
			{cover => (
				<TrackContent
					title={workItem.metadata.title ?? "Unknown title"}
					artist={workItem.metadata.artist ?? "Unknown artist"}
					album={workItem.metadata.album ?? "Unknown album"}
					albumArtist={workItem.metadata.albumArtist ?? "Unknown album artist"}
					year={workItem.metadata.year?.toString() ?? "Unknown year"}
					image={cover}
					buttons={
						<Button
							transparent
							text="Delete"
							ariaLabel="Delete"
							onClick={handleDeleteClick}
							leftIcon={className => <TrashIcon className={className} />}
						/>
					}
				/>
			)}
		</WorkItemCoverProvider>
	);
};

export interface AsideLocalFileContentProps {
	id: string;
}
