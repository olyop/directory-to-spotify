import XMarkIcon from "@heroicons/react/20/solid/XMarkIcon";
import { LayoutButton } from "components/layout-button";
import { FC } from "react";

export const ControlBarCancelButton: FC<ControlBarCancelButtonProps> = ({ onClick }) => (
	<LayoutButton
		ariaLabel="Cancel"
		text="Cancel"
		onClick={onClick}
		leftIcon={className => <XMarkIcon className={className} />}
	/>
);

export interface ControlBarCancelButtonProps {
	onClick: () => void;
}
