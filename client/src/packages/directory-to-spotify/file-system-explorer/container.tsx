import { FC, PropsWithChildren } from "react";

import { FileSystemExplorerContainerProps } from "./props";

export const FileSystemExplorerContainer: FC<PropsWithChildren<FileSystemExplorerContainerProps>> = ({
	className,
	children,
}) => <div className={`flex flex-col gap-1 font-mono ${className ?? ""}`}>{children}</div>;
