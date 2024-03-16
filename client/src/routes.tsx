import { createElement } from "react";
import { NonIndexRouteObject } from "react-router-dom";

import { AboutPage } from "./pages/about";
import { HomePage } from "./pages/home";

export const routes: NonIndexRouteObject[] = [
	{
		path: "",
		element: <HomePage />,
	},
	{
		path: "about",
		element: <AboutPage />,
	},
];
