/* eslint-disable react/destructuring-assignment */
import { FC, PropsWithChildren, createElement } from "react";

import { ModalContent } from "./content";
import { ModalPropTypes } from "./types";

export const Modal: FC<PropsWithChildren<ModalPropTypes>> = props => (
	<div
		className={`directory-to-spotify-modal fixed inset-0 z-[100] h-screen w-screen transition-opacity ${
			props.isOpen ? "visible opacity-100" : "invisible opacity-0"
		} ${props.className ?? ""}`}
	>
		<div
			aria-hidden
			onClick={props.disableCloseOnEscape ? undefined : props.onClose}
			className={`absolute inset-0 z-[110] cursor-pointer bg-black blur-[12px] transition-opacity ${
				props.isOpen ? "visible opacity-60" : "invisible opacity-0"
			} ${props.backgroundClassName ?? ""}`}
		/>
		{props.isOpen && <ModalContent {...props} />}
	</div>
);
