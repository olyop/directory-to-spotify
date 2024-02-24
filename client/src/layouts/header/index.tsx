import { FC } from "react";

import { HeaderAccount } from "./account";
import { HeaderLogo } from "./logo";
import { HeaderMenu } from "./menu";
import { HeaderShareButton } from "./share-button";

export const Header: FC = () => (
	<header className="flex relative items-center justify-between py-4 w-full bg-slate-800 shadow-2xl px-4 h-header-height">
		<HeaderMenu />
		<HeaderLogo />
		<div className="flex gap-4">
			<HeaderShareButton />
			<HeaderAccount />
		</div>
	</header>
);
