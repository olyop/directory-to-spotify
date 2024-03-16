import {
	AdjustmentsHorizontalIcon,
	ArrowPathIcon,
	ChevronDoubleRightIcon,
	PauseIcon,
	PlayIcon,
	PlusIcon,
	XMarkIcon,
} from "@heroicons/react/24/outline";
import { FC, Fragment, createElement } from "react";

import { Button } from "../../../components/button";
import { useAppDispatch } from "../../store";
import { useWorkItemsControlsSelector } from "../../store/selectors";
import { useStores } from "../../store/use-stores";
import { ViewLocalFileItem } from "../view-item/view-local-file-item";

export const Controls: FC<ControlsProps> = ({
	filter,
	error,
	onFilter,
	onCancel,
	onToggleMatching,
	onToggleAdding,
	onClearLibrary,
}) => {
	const stores = useStores();
	const dispatch = useAppDispatch();

	const { isAMatch, isMatching, isAdding, matched, total, matchesFound, workItem } = useWorkItemsControlsSelector();

	const handleClear = () => {
		dispatch(stores.workItemsStore.actions.clearWorkItemsMatch());
	};

	return (
		<Fragment>
			<div className="flex items-center gap-8">
				<Button
					transparent
					text="Cancel"
					ariaLabel="Cancel"
					onClick={onCancel}
					disabled={isMatching}
					leftIcon={className => <XMarkIcon className={className} />}
				/>
				{isAMatch && (
					<Button
						transparent
						text="Clear"
						ariaLabel="Clear"
						onClick={handleClear}
						disabled={isMatching}
						leftIcon={className => <XMarkIcon className={className} />}
					/>
				)}
				{error && <p className="text-red-500">{error.message}</p>}
				{isAMatch && (
					<Button
						transparent
						onClick={onFilter}
						ariaLabel="Filter"
						disabled={isMatching}
						text={filter ? "Show all" : `Filter (${total - matchesFound})`}
						leftIcon={className => <AdjustmentsHorizontalIcon className={className} />}
					/>
				)}
			</div>
			<div className="flex items-center gap-8">
				{workItem && isMatching && (
					<ViewLocalFileItem
						workItem={workItem}
						className="!grid-cols-[1fr,3.5rem]"
						imageClassName="order-1"
						contentClassName="pl-2 pr-3"
						textClassName="text-right"
					/>
				)}
				{matched === total ? (
					<Fragment>
						<Button
							transparent
							className="w-54 h-14 justify-between"
							onClick={onClearLibrary}
							text="Clear library"
							ariaLabel="Clear library"
							leftIcon={className => <XMarkIcon className={className} />}
						/>
						<Button
							onClick={onToggleAdding}
							className="w-54 h-14 justify-between"
							text={isAdding ? "Stop adding" : "Start adding"}
							ariaLabel={isAdding ? "Pause matching" : "Start matching"}
							leftIcon={className => <PlusIcon className={className} />}
							rightIcon={className =>
								isAdding ? (
									<ArrowPathIcon className={`animate-spin ${className}`} />
								) : (
									<ChevronDoubleRightIcon className={className} />
								)
							}
						/>
					</Fragment>
				) : (
					<Button
						onClick={onToggleMatching}
						className="h-14 w-48 justify-between"
						text={
							<div className="flex flex-col">
								<span>{isMatching ? "Pause" : "Start"}</span>
								<span className="font-mono text-xs">
									{matched}/{total}
								</span>
							</div>
						}
						ariaLabel={isMatching ? "Pause matching" : "Start matching"}
						leftIcon={className =>
							isMatching ? <PauseIcon className={className} /> : <PlayIcon className={className} />
						}
						rightIcon={className =>
							isMatching ? (
								<ArrowPathIcon className={`animate-spin ${className}`} />
							) : (
								<ChevronDoubleRightIcon className={className} />
							)
						}
					/>
				)}
			</div>
		</Fragment>
	);
};

export interface ControlsProps {
	filter: boolean;
	error: Error | null;
	onFilter: () => void;
	onCancel: () => void;
	onToggleMatching: () => void;
	onToggleAdding: () => void;
	onClearLibrary: () => void;
}
