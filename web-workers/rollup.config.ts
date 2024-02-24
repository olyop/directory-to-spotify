import typescript from "@rollup/plugin-typescript";
import { defineConfig } from "rollup";

export default defineConfig([
	{
		input: "./src/metadata-scanner.ts",
		output: {
			file: "../client/public/metadata-scanner.js",
		},
		plugins: [typescript()],
	},
	{
		input: "./src/service-worker.ts",
		output: {
			file: "../client/public/service-worker.js",
		},
		plugins: [typescript()],
	},
	{
		input: "./src/spotify-matcher.ts",
		output: {
			file: "../client/public/spotify-matcher.js",
		},
		plugins: [typescript()],
	},
]);
