import { ArrowPathIcon, PlayIcon } from "@heroicons/react/24/outline";
import { FC, Fragment, createElement } from "react";

export const WorkItemViewItem: FC<WorkItemViewItemProps> = ({
	title,
	artist,
	album,
	imageURL,
	isLoading,
	isPlaying,
	onPlayToggle,
	showAlbumForTitle = false,
	onClick,
	className,
	imageClassName,
	contentClassName,
	textClassName,
}) =>
	createElement(
		typeof onClick === "function" ? "button" : "div",
		{
			onClick,
			type: typeof onClick === "function" ? "button" : undefined,
			className: `hover:bg-spotify-hover focus:bg-spotify-hover group flex items-center gap-4 overflow-hidden rounded-lg px-2 py-2 transition-colors ${className ?? ""}`,
		},
		<Fragment>
			<div className={`relative size-12 min-h-12 min-w-12 overflow-hidden rounded-xl bg-black ${imageClassName ?? ""}`}>
				{isLoading ? (
					<div className="absolute left-0 top-0 z-10 flex size-full items-center justify-center p-1">
						<ArrowPathIcon className="size-6 animate-spin p-1" />
					</div>
				) : (isPlaying ?? null) || typeof onClick === "function" ? null : (
					<div className="absolute left-0 top-0 z-10 flex size-full items-center justify-center opacity-0 group-hover:opacity-100">
						<button
							type="button"
							onClick={onPlayToggle}
							className="hover:bg-spotify-base focus:bg-spotify-base group-button flex items-center justify-center rounded-full p-3 opacity-60 transition-colors"
						>
							<PlayIcon className="group-button-hover:text-primary size-6" />
						</button>
					</div>
				)}
				{imageURL && (
					<img
						src={imageURL}
						className={`size-full bg-black ${imageClassName ?? ""}`}
						alt={showAlbumForTitle ? album ?? "Unknown Album" : title ?? "Unknown Title"}
					/>
				)}
			</div>
			<div className={`flex flex-col items-start overflow-hidden ${contentClassName}`}>
				<p className={`truncate ${textClassName ?? ""}`}>
					{showAlbumForTitle ? album ?? "Unknown Album" : title ?? "Unknown Title"}
				</p>
				<p className={`truncate text-sm text-slate-500 ${textClassName}`}>{artist ?? "Unknown Artist"}</p>
			</div>
		</Fragment>,
	);

export interface WorkItemViewItemProps {
	title: string | null;
	artist: string | null;
	album: string | null;
	imageURL: string | null;
	isLoading: boolean;
	isPlaying?: boolean;
	onPlayToggle?: (() => void) | undefined;
	showAlbumForTitle?: boolean | undefined;
	onClick?: (() => void) | undefined;
	className?: string | undefined;
	imageClassName?: string | undefined;
	contentClassName?: string | undefined;
	textClassName?: string;
}
