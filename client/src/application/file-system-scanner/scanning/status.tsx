import { FC, Fragment, createElement } from "react";

import { useAppSelector } from "../../store";

export const ScanningStatus: FC = () => {
	const status = useAppSelector(state => state.workItems.scanStatus);

	return <Fragment>{status ?? "Loading"}</Fragment>;
};
