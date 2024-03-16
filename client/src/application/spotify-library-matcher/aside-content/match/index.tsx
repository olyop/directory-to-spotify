/* eslint-disable jsx-a11y/label-has-associated-control */
import { FC, Fragment, createElement } from "react";

import { useWorkItemInternalSelector } from "../../../store/selectors";
import { ViewLocalFileItem } from "../../view-item/view-local-file-item";
import { AsideMatchContentSearch } from "./search";

export const AsideMatchContent: FC<AsideMatchContentProps> = ({ id }) => {
	const workItem = useWorkItemInternalSelector(id);
	return (
		<Fragment>
			<ViewLocalFileItem workItem={workItem} />
			<AsideMatchContentSearch workItem={workItem} />
		</Fragment>
	);
};

export interface AsideMatchContentProps {
	id: string;
}
