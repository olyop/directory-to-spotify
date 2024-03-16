import {
	ArrowPathIcon,
	CheckIcon,
	ClipboardIcon,
	ExclamationTriangleIcon,
	ShareIcon,
} from "@heroicons/react/24/outline";
import { FC, createElement } from "react";

import { Button } from "../button";
import { useShare } from "./use-share";

export const ShareButton: FC = () => {
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

	return <Button transparent text={text} ariaLabel={text} onClick={handleShare} leftIcon={icon} />;
};
