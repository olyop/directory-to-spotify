import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { FC, ReactNode, createElement } from "react";

import { Page, PageProps } from "../../components/page";

export const Loading: FC<LoadingProps> = ({ text, ...pageProps }) => (
	<Page
		contentNode={
			<div className="flex flex-col items-center gap-4">
				<ArrowPathIcon className="size-12 animate-spin" />
				<p className="text-center">{text ?? "Loading"}</p>
			</div>
		}
		contentClassName="flex justify-center items-center"
		{...pageProps}
	/>
);

export interface LoadingProps extends Omit<PageProps, "contentNode"> {
	text?: ReactNode | undefined;
}
