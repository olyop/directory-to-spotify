import { Button, ButtonProps } from "components/button";
import { FC } from "react";

export const LayoutButton: FC<ButtonProps> = ({ leftIcon, rightIcon, className, textClassName, ...buttonProps }) => (
	<Button
		{...buttonProps}
		leftIcon={leftIcon ? leftIconClassName => leftIcon(`${leftIconClassName} rounded-full h-6 w-6`) : undefined}
		rightIcon={rightIcon ? rightIconClassName => rightIcon(`${rightIconClassName} rounded-full h-6 w-6`) : undefined}
		textClassName={`text-md ${textClassName ?? ""}`}
		className={`bg-transparent px-4 hover:bg-transparent hover:shadow-none border border-slate-500 h-auto py-3 gap-3 hover:!bg-slate-900 focus:!bg-slate-900 w-auto ${
			className ?? ""
		}`}
	/>
);
