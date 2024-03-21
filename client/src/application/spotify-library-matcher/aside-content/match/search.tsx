import { CheckCircleIcon, CheckIcon } from "@heroicons/react/24/outline";
import { ChangeEvent, FC, Fragment, createElement, useEffect, useState } from "react";

import { useSpotify } from "../../../../packages/spotify-web-api-react";
import { useAppDispatch } from "../../../store";
import { useStores } from "../../../store/use-stores";
import { search } from "../../controls/matcher-control/match-work-items";
import { ViewSpotifyTrackItem } from "../../view-item/view-spotify-track-item";
import { WorkItemInternal } from "../../work-item-view/types";

export const AsideMatchContentSearch: FC<AsideMatchContentSearchProps> = ({ workItem }) => {
	const stores = useStores();
	const dispatch = useAppDispatch();
	const { client } = useSpotify();

	const [query, setQuery] = useState(workItem.match?.query ?? "");
	const [results, setResults] = useState<string[]>(workItem.match?.results?.map(result => result.trackID) ?? []);

	const handleSearch = async (value: string) => {
		const response = await search(client, value);

		setResults(response.map(result => result.id));
	};

	const handleQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
		setQuery(event.target.value);

		void handleSearch(event.target.value);
	};

	const handleChooseSearchResult = (trackID: string) => () => {
		dispatch(
			stores.workItemsStore.actions.updateWorkItemMatchTrackID({
				id: workItem.id,
				trackID,
				type: "manual",
			}),
		);
	};

	useEffect(() => {
		setQuery(workItem.match?.query ?? "");
		setResults(workItem.match?.results?.map(result => result.trackID) ?? []);
	}, [workItem.match?.query, workItem.id]);

	return (
		<Fragment>
			<label htmlFor="query" className="flex flex-col items-start justify-start gap-2 text-gray-300">
				<b>Query</b>
				<input
					type="text"
					name="query"
					id="query"
					value={query}
					onChange={handleQueryChange}
					placeholder="Search manually..."
					className="w-full rounded-lg bg-slate-600 px-2 py-1"
				/>
			</label>
			<div className="flex flex-col gap-2">
				<h3 className="text-gray-300">
					<b>Results</b>
				</h3>
				<div className="flex flex-col gap-2">
					{workItem.match?.results ? (
						results.map(trackID => (
							<ViewSpotifyTrackItem
								key={trackID}
								trackID={trackID}
								contentButton={{
									title: "Choose",
									onClick: handleChooseSearchResult(trackID),
									icon: iconClassName =>
										workItem.match?.trackID === trackID ? (
											<CheckCircleIcon className={iconClassName} />
										) : (
											<CheckIcon className={iconClassName} />
										),
								}}
							/>
						))
					) : (
						<p>No results found</p>
					)}
				</div>
			</div>
		</Fragment>
	);
};

export interface AsideMatchContentSearchProps {
	workItem: WorkItemInternal;
}
