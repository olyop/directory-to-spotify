import { AdjustmentsHorizontalIcon } from "@heroicons/react/24/outline";
import { FC, createElement } from "react";

import { Button } from "../../../components/button";
import { useAppDispatch } from "../../store";
import { useStores } from "../../store/use-stores";

export const FilterControl: FC<FilterControlProps> = ({ filter, isMatching, total, matchesFound }) => {
	const stores = useStores();
	const dispatch = useAppDispatch();

	const handleClick = () => {
		dispatch(stores.workItemsStore.actions.toggleFilter());
	};

	return (
		<Button
			transparent
			ariaLabel="Filter"
			className="h-14 w-36 justify-between"
			disabled={isMatching}
			onClick={handleClick}
			text={
				<div className="flex flex-col">
					<span className="font-mono text-xs">{filter ? "Show All" : "Filter"}</span>
					<span className="font-mono text-xs">{total - matchesFound}</span>
				</div>
			}
			leftIcon={className => <AdjustmentsHorizontalIcon className={className} />}
		/>
	);
};

export interface FilterControlProps {
	filter: boolean;
	isMatching: boolean;
	total: number;
	matchesFound: number;
}
