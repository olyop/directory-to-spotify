import { FC, createElement } from "react";
import { Route, Routes } from "react-router-dom";

import { AboutPage } from "./pages/about";
import { HomePage } from "./pages/home";

export const Content: FC = () => (
	<div className="h-screen w-screen bg-black font-sans text-white">
		<Routes>
			<Route path="" element={<HomePage />} />
			<Route path="about" element={<AboutPage />} />
		</Routes>
	</div>
);
