import { Main } from "main";
import { Spotify } from "providers/spotify";
import { createRoot } from "react-dom/client";
import { BrowserRouter as ReactRouter } from "react-router-dom";
import "tailwindcss/tailwind.css";

import "./index.css";

const container = document.getElementById("root") as HTMLDivElement | null;

if (!container) {
	throw new Error("No root element found");
}

const root = createRoot(container);

root.render(
	<ReactRouter>
		<Spotify>
			<Main />
		</Spotify>
	</ReactRouter>,
);
