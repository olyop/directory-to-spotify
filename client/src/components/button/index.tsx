import { FC, ReactNode } from "react";

const baseIconClassName = "h-5 w-5";

export const Button: FC<ButtonProps> = ({
	id,
	transparent = false,
	isSubmit = false,
	leftIcon,
	text,
	ariaLabel,
	rightIcon,
	onClick,
	className,
	iconClassName,
	textClassName,
	disabled,
	childrenNode,
}) => (
	<button
		id={id}
		type={isSubmit ? "submit" : "button"}
		title={text && typeof text === "string" ? text : ariaLabel}
		disabled={disabled}
		aria-label={ariaLabel}
		onClick={onClick}
		className={`${
			text === undefined && (leftIcon !== undefined || rightIcon !== undefined)
				? "p-2 rounded-full w-9 h-9"
				: "px-4 h-9"
		} font-bold rounded-lg ${
			transparent
				? "text-black bg-transparent hover:bg-slate-700"
				: disabled
				  ? "cursor-not-allowed text-gray-500 bg-gray-200 !shadow-none"
				  : "cursor-pointer text-white bg-primary hover:bg-primary-dark shadow"
		} text-sm uppercase flex items-center justify-center gap-2 ${transparent ? "" : "shadow-sm"} ${
			disabled ? "" : "hover:shadow-md"
		} select-none transition-all items-center ${className ?? ""}`}
	>
		{leftIcon && leftIcon(`${baseIconClassName} ${iconClassName ?? ""}`)}
		{text && (textClassName ? <span className={textClassName}>{text}</span> : text)}
		{rightIcon && rightIcon(`${baseIconClassName} ${iconClassName ?? ""}`)}
		{childrenNode}
	</button>
);

export interface ButtonProps {
	id?: string;
	transparent?: boolean;
	isSubmit?: boolean;
	leftIcon?: ((className: string) => ReactNode) | undefined;
	text?: ReactNode | undefined;
	ariaLabel: string;
	childrenNode?: ReactNode;
	rightIcon?: ((className: string) => ReactNode) | undefined;
	onClick?: (() => void) | undefined;
	className?: string | undefined;
	iconClassName?: string | undefined;
	textClassName?: string | undefined;
	disabled?: boolean;
}
