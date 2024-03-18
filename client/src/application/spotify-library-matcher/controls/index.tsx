import { AdjustmentsHorizontalIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { FC, Fragment, createElement } from "react";

import { Button } from "../../../components/button";
import { useAppDispatch } from "../../store";
import { useWorkItemsControlsSelector } from "../../store/selectors";
import { useStores } from "../../store/use-stores";
import { ViewLocalFileItem } from "../view-item/view-local-file-item";
import { AddToSpotifyControl } from "./add-to-spotify-control";
import { ClearLibraryControl } from "./clear-library-control";
import { MatchingControl } from "./matching-control";

export const Controls: FC<ControlsProps> = ({ filter, onFilterToggle, onCancel }) => {
	const stores = useStores();
	const dispatch = useAppDispatch();

	const { isMatching, isAdding, isClearing, isAMatch, matched, total, matchesFound, workItem } =
		useWorkItemsControlsSelector();

	const handleClear = () => {
		dispatch(stores.workItemsStore.actions.clearWorkItemsMatch());
	};

	return (
		<Fragment>
			{workItem && isMatching ? <ViewLocalFileItem workItem={workItem} /> : <div />}
			<div className="flex items-center justify-end gap-4">
				<Button
					transparent
					text="Cancel"
					ariaLabel="Cancel"
					className="h-14"
					onClick={onCancel}
					disabled={isMatching}
					leftIcon={className => <XMarkIcon className={className} />}
				/>
				{isAMatch && (
					<Button
						transparent
						text="Clear"
						ariaLabel="Clear"
						className="h-14"
						onClick={handleClear}
						disabled={isMatching}
						leftIcon={className => <XMarkIcon className={className} />}
					/>
				)}
				{isAMatch && (
					<Button
						transparent
						ariaLabel="Filter"
						className="h-14 w-44 justify-between"
						disabled={isMatching}
						onClick={onFilterToggle}
						text={
							<div className="flex flex-col">
								<span>{filter ? "Show All" : "Filter"}</span>
								<span className="font-mono text-xs">{total - matchesFound}</span>
							</div>
						}
						leftIcon={className => <AdjustmentsHorizontalIcon className={className} />}
					/>
				)}
				{matched === total ? (
					<Fragment>
						<ClearLibraryControl isClearing={isClearing} />
						<AddToSpotifyControl isAdding={isAdding} />
					</Fragment>
				) : (
					<MatchingControl isMatching={isMatching} matched={matched} total={total} />
				)}
			</div>
		</Fragment>
	);
};

export interface ControlsProps {
	filter: boolean;
	onFilterToggle: () => void;
	onCancel: () => void;
}
