/* eslint-disable jsx-a11y/label-has-associated-control */
import PencilIcon from "@heroicons/react/24/outline/PencilIcon";
import { FC, Fragment, createElement } from "react";

import { Button } from "../../../../components/button";
import { useAppDispatch } from "../../../store";
import { useStores } from "../../../store/use-stores";
import { WorkItemInternal } from "../types";

export const WorkItemViewMatchEdit: FC<WorkItemViewMatchModalProps> = ({ workItem }) => {
	const stores = useStores();
	const dispatch = useAppDispatch();

	const handleMatchEdit = () => {
		dispatch(
			stores.workItemsStore.actions.setSelected({
				id: workItem.id,
				type: "match",
			}),
		);
	};

	const { match } = workItem;

	const matchFound = match && match.trackID;

	return (
		<Button
			transparent
			onClick={handleMatchEdit}
			ariaLabel={matchFound ? match.type : "No Results"}
			className="flex h-auto items-center justify-center border border-slate-600 px-0 py-0 hover:bg-slate-800 focus:bg-slate-800"
			spanClassName={`size-full ${matchFound ? (match.type === "exact" || match.type === "manual" ? "text-green-500" : "text-blue-500") : "text-orange-500"}`}
			text={
				<Fragment>
					<span className="block border-b border-slate-600 px-5 text-[0.6rem]">
						<b>{matchFound ? match.type : "No Match"}</b>
					</span>
					<div className="flex items-center gap-3 px-5 py-1">
						<PencilIcon className="size-4" />
						<span className="text-[1.1rem]">Edit</span>
					</div>
				</Fragment>
			}
		/>
	);
};

/* {workItem.match && (
	<Modal
		fullHeight
		isOpen={isModalOpen}
		onClose={closeModal}
		title={workItem.metadata.title ?? "Unknown"}
		subTitle={workItem.metadata.artist ?? "Unknown"}
		contentClassName="flex flex-col gap-8"
		icon={className => <MusicalNoteIcon className={className} />}
	>
		<div className="flex flex-col items-start justify-start gap-2 p-1">
			<label htmlFor="query" className="text-sm uppercase">
				<b>Query:</b>
			</label>
			<input
				type="text"
				src={query}
				onChange={handleQueryChange}
				name="query"
				id="query"
				value={query}
				placeholder="Search manually..."
				className="w-full rounded-lg bg-slate-600 px-2 py-1"
			/>
		</div>
		<div className="flex flex-col items-start gap-2">
			<h3>Search manually</h3>
			<Button ariaLabel="Search manually" text="Search" />
		</div>
		<div className="flex flex-col gap-2">
			<h3 className="text-gray-300">Results</h3>
			<div className="flex flex-col gap-4 pr-4">
				{workItem.match.results ? (
					[...workItem.match.results]
						.sort(matchResultsSorter)
						.map(result => (
							<WorkItemViewTrackItem
								key={result.trackID}
								trackID={result.trackID}
								onClick={handleResultClick(result.trackID)}
								className="hover:bg-slate-800"
							/>
						))
				) : (
					<p>No results found</p>
				)}
			</div>
		</div>
	</Modal>
)} */

// function matchResultsSorter(a: WorkItemResult, b: WorkItemResult) {
// 	return (a.score ?? 0) - (b.score ?? 0);
// }

export interface WorkItemViewMatchModalProps {
	workItem: WorkItemInternal;
}
