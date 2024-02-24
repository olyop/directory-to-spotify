import { Main } from "main";
import { Spotify } from "providers/spotify";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as ReactRouter } from "react-router-dom";
import "tailwindcss/tailwind.css";

import "./index.css";

const container = document.getElementById("root");

if (!container) {
	throw new Error("No root element found");
}

const root = createRoot(container);

root.render(
	<StrictMode>
		<ReactRouter>
			<Spotify>
				<Main />
			</Spotify>
		</ReactRouter>
	</StrictMode>,
);
