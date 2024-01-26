import ChevronDoubleRightIcon from "@heroicons/react/20/solid/ChevronDoubleRightIcon";
import ExclamationCircleIcon from "@heroicons/react/20/solid/ExclamationCircleIcon";
import { BigButton } from "components/big-button";
import { Button } from "components/button";
import { Modal } from "components/modal";
import { useModal } from "hooks/use-modal";
import { FC, Fragment } from "react";

export const ControlBarScanButton: FC<ControlBarProps> = ({ onSetMain }) => {
	const [isModalOpen, openModal, closeModal] = useModal();

	return (
		<Fragment>
			<BigButton
				ariaLabel="Scan"
				rightIcon={className => <ChevronDoubleRightIcon className={className} />}
				text="Scan"
				className="pl-6"
				onClick={openModal}
			/>
			<Modal
				isOpen={isModalOpen}
				onClose={closeModal}
				title="Scan"
				icon={className => <ExclamationCircleIcon className={className} />}
			>
				<Button
					ariaLabel="Scan"
					rightIcon={className => <ChevronDoubleRightIcon className={className} />}
					text="Scan"
					className="pl-6"
					onClick={onSetMain}
				/>
			</Modal>
		</Fragment>
	);
};

export interface ControlBarProps {
	onSetMain: () => void;
}
