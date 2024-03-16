import { FC, HTMLAttributes, PropsWithChildren, ReactHTML, createElement, memo } from "react";

import { ClassNameProps } from "../../props";

export const Elevated: FC<PropsWithChildren<ElevatedProps>> = memo(
	({ type = "div", children, className = "", contentClassName = "" }) =>
		createElement<HTMLAttributes<HTMLDivElement>, HTMLDivElement>("div", {
			className: `p-2 ${className}`,
			children: createElement<HTMLAttributes<HTMLDivElement>, HTMLDivElement>(type, {
				className: `bg-spotify-base size-full overflow-hidden rounded-2xl pl-4 py-4 ${contentClassName}`,
				children,
			}),
		}),
);

export interface ElevatedProps extends ClassNameProps {
	type?: keyof ReactHTML;
	contentClassName?: string | undefined;
}
