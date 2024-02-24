import { FC, Fragment } from "react";

import { ControlBarCancelButton } from "./cancel-button";
import { ControlBarScanButton } from "./scan-button";

export const ControlBar: FC<ControlBarProps> = ({ isMain, hasChosenDirectory, onSetMain, onCancel }) => (
	<div className="bg-slate-800 flex items-center justify-center gap-6 p-4 w-full h-control-bar-height shadow-2xl">
		{isMain ? null : hasChosenDirectory ? (
			<Fragment>
				<ControlBarCancelButton onClick={onCancel} />
				<ControlBarScanButton onSetMain={onSetMain} />
			</Fragment>
		) : null}
	</div>
);

export interface ControlBarProps {
	isMain: boolean;
	hasChosenDirectory: boolean;
	onSetMain: () => void;
	onCancel: () => void;
}
