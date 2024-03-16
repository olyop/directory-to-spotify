import { useIntersectionObserver } from "@uidotdev/usehooks";
import { FC, createElement } from "react";

import { WorkItemViewInternal } from "./internal";

export const WorkItemView: FC<WorkItemViewProps> = ({ workItemID }) => {
	const [ref, entry] = useIntersectionObserver({ threshold: 0, root: null });

	return (
		<div
			ref={ref}
			data-id={workItemID}
			className="border-spotify-hover relative grid h-[5rem] grid-cols-[1fr,8rem,1fr] grid-rows-1 items-center justify-items-stretch gap-2 border-b last:border-0"
		>
			{entry?.isIntersecting && <WorkItemViewInternal workItemID={workItemID} />}
		</div>
	);
};

export interface WorkItemViewProps {
	workItemID: string;
}
