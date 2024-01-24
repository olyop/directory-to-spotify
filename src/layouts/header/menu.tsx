import Bars4Icon from "@heroicons/react/20/solid/Bars4Icon";
import { Button } from "components/button";
import { FC } from "react";

export const HeaderMenu: FC = () => (
	<Button
		transparent
		ariaLabel="Menu"
		className="!w-12 !h-12"
		iconClassName="text-white !w-9 !h-9"
		leftIcon={className => <Bars4Icon className={className} />}
	/>
);
