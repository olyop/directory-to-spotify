import { Button, ButtonProps } from "components/button";
import { FC } from "react";

export const BigButton: FC<ButtonProps> = ({
	leftIcon,
	rightIcon,
	className,
	iconClassName,
	textClassName,
	...buttonProps
}) => (
	<Button
		{...buttonProps}
		leftIcon={leftIcon ? leftIconClassName => leftIcon(`${leftIconClassName} rounded-full h-6 w-6`) : undefined}
		rightIcon={rightIcon ? rightIconClassName => rightIcon(`${rightIconClassName} rounded-full h-6 w-6`) : undefined}
		className={`!h-14 px-6 gap-4 ${className ?? ""}`}
		iconClassName={`!w-9 !h-9 ${iconClassName ?? ""}`}
		textClassName={`text-2xl ${textClassName ?? ""}`}
	/>
);
