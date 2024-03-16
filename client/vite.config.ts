/* eslint-disable unicorn/better-regex */
import { readFile } from "node:fs/promises";

import reactSwc from "@vitejs/plugin-react-swc";
import { Plugin, UserConfig, defineConfig, loadEnv } from "vite";
import { imagetools } from "vite-imagetools";
import checker from "vite-plugin-checker";

import { determineContentSecurityPolicy } from "./vite/determine-content-security-policy";
import { Mode } from "./vite/types";

const checkerOptions: Parameters<typeof checker>[0] = {
	typescript: true,
	eslint: {
		lintCommand: "eslint",
		dev: {
			overrideConfig: {
				overrideConfig: {
					parserOptions: {
						project: "./tsconfig.eslint.json",
					},
				},
			},
		},
	},
};

const html = (variables: Record<string, string>): Plugin => ({
	name: "html-transform",
	transformIndexHtml: {
		order: "pre",
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
		handler: (value: string): string => value.replaceAll(/{{ (.*?) }}/g, (match, p1) => variables[p1] ?? match),
	},
});

export default defineConfig(async options => {
	const mode = options.mode as Mode;

	const environmentVariables = loadEnv(mode, process.cwd(), "");

	process.env = { ...process.env, ...environmentVariables };

	const config: UserConfig = {
		plugins: [
			reactSwc(),
			imagetools(),
			checker(checkerOptions),
			html({ "VITE_CONTENT_SECURITY_POLICY": determineContentSecurityPolicy(mode) }),
		],
		define: {
			__DEV__: JSON.stringify(mode === "development"),
			"globalThis.__DEV__": JSON.stringify(mode === "development"),
		},
		server: {
			https:
				mode === "development"
					? {
							cert: await readFile(process.env.TLS_CERT_PATH),
							key: await readFile(process.env.TLS_KEY_PATH),
						}
					: undefined,
		},
	};

	return config;
});

declare global {
	// eslint-disable-next-line @typescript-eslint/no-namespace
	namespace NodeJS {
		// eslint-disable-next-line unicorn/prevent-abbreviations
		interface ProcessEnv {
			TLS_CERT_PATH: string;
			TLS_KEY_PATH: string;
		}
	}
}
