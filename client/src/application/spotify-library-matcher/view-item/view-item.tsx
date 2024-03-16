import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { FC, Fragment, ReactNode, createElement } from "react";

import { Button } from "../../../components/button";

export const ViewItem: FC<ViewItemProps> = ({
	title,
	artist,
	imageURL,
	isLoading = false,
	imageButton,
	contentButton,
	onContentClick,
	className,
	imageClassName = "",
	contentClassName = "",
	textClassName = "",
}) => (
	<div
		className={`grid w-full min-w-0 items-center gap-2 ${contentButton ? "grid-cols-[3rem,1fr,3rem]" : "grid-cols-[3rem,1fr]"} ${className}`}
	>
		<div className={`relative size-12 overflow-hidden rounded-xl bg-black ${imageClassName}`}>
			{(isLoading || imageButton) && (
				<div className="absolute left-0 top-0 z-10 flex size-full items-center justify-center">
					{isLoading ? (
						<ArrowPathIcon className="size-6 animate-spin" />
					) : (
						imageButton && (
							<Button
								transparent
								onClick={imageButton.onClick}
								ariaLabel={imageButton.title ?? "Unknown Title"}
								leftIcon={iconClassName => imageButton.icon(iconClassName)}
								className="!bg-spotify-base rounded-none border-0 opacity-0 transition-all hover:opacity-50 focus:opacity-100"
							/>
						)
					)}
				</div>
			)}
			{imageURL && (
				<img src={imageURL} alt={title ?? "Unknown Title"} className={`size-full bg-black ${imageClassName}`} />
			)}
		</div>
		{createElement(
			onContentClick ? "button" : "div",
			{
				title: title ?? "Unknown Title",
				onClick: onContentClick ?? undefined,
				type: onContentClick ? "button" : undefined,
				className: `hover:bg-spotify-hover focus:bg-spotify-hover transition flex h-14 min-w-0 flex-col items-start justify-between px-3 py-2 rounded-2xl ${contentClassName}`,
			},
			<Fragment>
				<p className={`text w-full truncate text-left ${textClassName}`}>{title ?? ""}</p>
				<p className={`w-full truncate text-left text-sm text-slate-500 ${textClassName}`}>{artist ?? ""}</p>
			</Fragment>,
		)}
		{contentButton && (
			<Button
				transparent
				onClick={contentButton.onClick}
				ariaLabel={contentButton.title ?? "Unknown Title"}
				leftIcon={iconClassName => contentButton.icon(iconClassName)}
			/>
		)}
	</div>
);

export interface ViewItemProps {
	title: string | undefined | null;
	artist: string | undefined | null;
	imageURL: string | undefined | null;
	isLoading?: boolean;
	imageButton?: WorkItemViewAction | null;
	onContentClick?: (() => void) | undefined;
	contentButton?: WorkItemViewAction | null | undefined;
	className?: string | undefined;
	imageClassName?: string | undefined;
	contentClassName?: string | undefined;
	textClassName?: string | undefined;
}

export interface WorkItemViewAction {
	title: string | null;
	icon: (className: string) => ReactNode;
	onClick: () => void;
}
