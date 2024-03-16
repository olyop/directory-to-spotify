import { FC, createElement } from "react";

export const DataItem: FC<DataItemProps> = ({ label, value }) => (
	<div title={value?.toString() ?? "Unknown"}>
		<h3 className="truncate text-xs uppercase">{label}</h3>
		<p className="truncate text-sm text-gray-500">{value ?? "Unknown"}</p>
	</div>
);

export interface DataItemProps {
	label: string;
	value?: string | number | null | undefined;
	className?: string;
}
