import { ReactNode } from "react";

export interface ModalPropTypes {
	isOpen: boolean;
	title?: string;
	titleContent?: ReactNode;
	subTitle?: ReactNode;
	icon?: (className: string) => ReactNode;
	onClose?: () => void;
	buttons?: ReactNode;
	className?: string | undefined;
	modalClassName?: string;
	contentClassName?: string;
	buttonClassName?: string;
	backgroundClassName?: string;
	hideTitle?: boolean;
	centerTitle?: boolean;
	disableCloseOnEscape?: boolean;
	fullHeight?: boolean;
	hideCloseButton?: boolean;
}
