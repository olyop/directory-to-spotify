import { TrashIcon } from "@heroicons/react/24/outline";
import { FC, Fragment, createElement } from "react";

import { Button } from "../../../components/button";
import { Modal } from "../../../components/modal";
import { useModal } from "../../../hooks/use-modal";
import { useAppDispatch } from "../../store";
import { useStores } from "../../store/use-stores";
import { WorkItemCoverProvider } from "../work-item-cover-provider";
import { WorkItemInternal } from "../work-item-view/types";
import { ViewItem } from "./view-item";

export const ViewLocalFileItem: FC<ViewMetadataItemProps> = ({
	workItem,
	className,
	imageClassName,
	contentClassName,
	textClassName,
}) => {
	const stores = useStores();
	const dispatch = useAppDispatch();

	const [isDeleteModalOpen, openDeleteModal, closeDeleteModal] = useModal();

	const handleSelected = () => {
		dispatch(
			stores.workItemsStore.actions.setSelected({
				id: workItem.id,
				type: "metadata",
			}),
		);
	};

	const handleDelete = () => {
		closeDeleteModal();

		dispatch(stores.workItemsStore.actions.skipWorkItem(workItem.id));
	};

	return (
		<WorkItemCoverProvider workItem={workItem}>
			{metadataCover => (
				<Fragment>
					<ViewItem
						isLoading={workItem.isLoading}
						title={workItem.metadata.title}
						artist={workItem.metadata.artist}
						imageURL={metadataCover}
						className={className}
						imageClassName={imageClassName}
						contentClassName={contentClassName}
						textClassName={textClassName}
						imageButton={{
							icon: iconClassName => <TrashIcon className={iconClassName} />,
							onClick: openDeleteModal,
							title: `Delete ${workItem.metadata.title} by ${workItem.metadata.artist}`,
						}}
						onContentClick={handleSelected}
					/>
					<Modal
						isOpen={isDeleteModalOpen}
						onClose={closeDeleteModal}
						icon={iconClassName => <TrashIcon className={iconClassName} />}
						title="Delete Work Item"
						children={
							<p>
								Are you sure you want to delete <strong>{workItem.metadata.title}</strong> by{" "}
							</p>
						}
						buttons={[
							<Button
								key="cancel"
								text="Delete"
								ariaLabel={`Delete ${workItem.metadata.title} by ${workItem.metadata.artist}`}
								onClick={handleDelete}
							/>,
						]}
					/>
				</Fragment>
			)}
		</WorkItemCoverProvider>
	);
};

export interface ViewMetadataItemProps {
	workItem: WorkItemInternal;
	className?: string;
	imageClassName?: string;
	contentClassName?: string;
	textClassName?: string;
}
