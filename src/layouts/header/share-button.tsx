import ArrowPathIcon from "@heroicons/react/20/solid/ArrowPathIcon";
import CheckIcon from "@heroicons/react/20/solid/CheckIcon";
import ClipboardIcon from "@heroicons/react/20/solid/ClipboardIcon";
import ExclamationTriangleIcon from "@heroicons/react/20/solid/ExclamationTriangleIcon";
import ShareIcon from "@heroicons/react/20/solid/ShareIcon";
import { Button } from "components/button";
import { useShare } from "hooks/use-share";
import { FC } from "react";

export const HeaderShareButton: FC = () => {
	const [handleShare, { hasShared, hasCopiedShared, hasError }] = useShare(window.location.origin);

	const text =
		hasShared === null
			? "Share"
			: hasShared
			  ? hasCopiedShared
					? hasError
						? "Error"
						: "Copied!"
					: "Shared!"
			  : "Sharing";

	const icon = (className: string) =>
		hasShared === null ? (
			<ShareIcon className={className} />
		) : hasShared ? (
			hasCopiedShared ? (
				hasError ? (
					<ExclamationTriangleIcon className={className} />
				) : (
					<ClipboardIcon className={className} />
				)
			) : (
				<CheckIcon className={className} />
			)
		) : (
			<ArrowPathIcon className={className} />
		);

	return (
		<Button
			text={text}
			ariaLabel={text}
			onClick={handleShare}
			leftIcon={icon}
			textClassName="text-md"
			className="px-3 bg-transparent hover:bg-transparent hover:shadow-none border border-slate-500 h-auto py-3 gap-3 hover:!bg-slate-900 focus:!bg-slate-900 w-auto"
		/>
	);
};
