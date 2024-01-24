import { Content } from "layouts/content";
import { Header } from "layouts/header";
import { FC } from "react";

export const Main: FC = () => (
	<div className="w-screen h-screen bg-slate-900 text-white overflow-hidden">
		<Header />
		<Content />
	</div>
);
