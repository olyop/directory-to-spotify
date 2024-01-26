import XMarkIcon from "@heroicons/react/20/solid/XMarkIcon";
import { BigButton } from "components/big-button";
import { FC } from "react";

export const ControlBarCancelButton: FC<ControlBarCancelButtonProps> = ({ onClick }) => (
	<BigButton
		ariaLabel="Cancel"
		text="Cancel"
		onClick={onClick}
		leftIcon={className => <XMarkIcon className={className} />}
	/>
);

export interface ControlBarCancelButtonProps {
	onClick: () => void;
}
