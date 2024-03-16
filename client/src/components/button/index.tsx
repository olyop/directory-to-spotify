import { FC, ReactNode, createElement } from "react";

const baseIconClassName = "size-7";

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
	spanClassName,
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
				? "size-12 min-h-12 min-w-12 rounded-full"
				: "h-12 rounded-2xl pl-4 pr-4"
		} border-spotify-hover border ${
			transparent
				? disabled
					? "cursor-not-allowed border-transparent bg-black"
					: "hover:bg-spotify-hover focus:bg-spotify-hover bg-transparent"
				: disabled
					? "cursor-not-allowed"
					: "bg-primary-dark hover:bg-primary focus:bg-primary cursor-pointer shadow"
		} flex select-none items-center items-center justify-center gap-3 text-sm uppercase transition-all ${className ?? ""}`}
	>
		{leftIcon && leftIcon(`${baseIconClassName} ${spanClassName ?? ""} ${iconClassName ?? ""}`)}
		{text && (
			<b>
				<span className={`-mt-0.5 ${spanClassName} ${textClassName ?? ""}`}>{text}</span>
			</b>
		)}
		{rightIcon && rightIcon(`${baseIconClassName} ${spanClassName ?? ""} ${iconClassName ?? ""}`)}
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
	spanClassName?: string | undefined;
	iconClassName?: string | undefined;
	textClassName?: string | undefined;
	disabled?: boolean;
}
