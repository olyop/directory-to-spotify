import { XMarkIcon } from "@heroicons/react/24/outline";
import { FC, PropsWithChildren, createElement, useEffect } from "react";

import { useKeyPress } from "../../hooks/use-key-press";
import { Button } from "../button";
import { ModalPropTypes } from "./types";

// @ts-expect-error
// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
const isMobile = "userAgentData" in navigator ? (navigator.userAgentData.mobile as boolean) : false;

export const ModalContent: FC<PropsWithChildren<ModalPropTypes>> = ({
	title,
	titleContent,
	subTitle,
	icon,
	buttons,
	onClose,
	children,
	modalClassName,
	contentClassName,
	buttonClassName,
	fullHeight = false,
	hideTitle = false,
	centerTitle = false,
	hideCloseButton = false,
	disableCloseOnEscape = false,
}) => {
	const escapePress = useKeyPress("Escape");

	useEffect(() => {
		if (escapePress && onClose) {
			onClose();
		}
	}, [escapePress]);

	return (
		<div
			className={`absolute left-1/2 top-8 z-[120] flex ${fullHeight ? "h-[calc(100vh_-_5rem)]" : "max-h-[calc(100vh_-_5rem)]"} bg-spotify-hover w-[calc(100vw_-_3rem)] -translate-x-1/2 flex-col gap-4 rounded-md p-4 md:top-1/2 md:w-[45rem] md:-translate-y-1/2 ${
				modalClassName ?? ""
			}`}
		>
			{!disableCloseOnEscape && !hideCloseButton && onClose && title && (
				<Button
					onClick={onClose}
					ariaLabel={`Close ${title}`}
					className="absolute -right-4 -top-4 !px-4"
					leftIcon={c => <XMarkIcon className={c} />}
					text={
						isMobile ? (
							"Close"
						) : (
							<div className="flex items-center gap-2">
								<span>Close</span>
								<span className="rounded border px-1 py-0.5 text-xs uppercase">esc</span>
							</div>
						)
					}
				/>
			)}
			{!hideTitle && icon && (
				<div
					className={`-mt-1 flex gap-2 ${subTitle === undefined ? "items-center" : "items-start"} ${
						centerTitle ? "justify-center" : "justify-start"
					} border-b border-b-gray-200 pb-2`}
				>
					{icon(`h-5 w-5 ${subTitle === undefined ? "mt-0.5" : "mt-1.5"} select-none`)}
					<div className="flex flex-col gap-1">
						<h1 className="text-xl md:text-2xl">{title}</h1>
						{titleContent}
						{subTitle && <h2 className="text-sm text-gray-500">{subTitle}</h2>}
					</div>
				</div>
			)}
			<div className={`overflow-auto py-2 ${contentClassName ?? ""}`}>{children}</div>
			{buttons && <div className={`flex gap-2 ${buttonClassName ?? ""}`}>{buttons}</div>}
		</div>
	);
};
