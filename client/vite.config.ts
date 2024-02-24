import { readFile } from "node:fs/promises";

import reactSwc from "@vitejs/plugin-react-swc";
import contentSecurityPolicyBuilder from "content-security-policy-builder";
import { Plugin, defineConfig } from "vite";
import { imagetools } from "vite-imagetools";
import checker from "vite-plugin-checker";
import tsconfigPaths from "vite-tsconfig-paths";

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

const determineContentSecurityPolicy = (mode: string) => {
	const isProduction = mode === "production";

	return contentSecurityPolicyBuilder({
		directives: {
			defaultSrc: ["'self'"],
			scriptSrc: [
				"'self'",
				"https://*.google.com",
				"https://*.gstatic.com",
				"https://*.googleapis.com",
				isProduction ? "" : "'unsafe-inline'",
			],
			styleSrc: ["'self'", isProduction ? "" : "'unsafe-inline'", " https://*.googleapis.com"],
			objectSrc: ["'none'"],
			connectSrc: ["'self'", "https://accounts.spotify.com", "https://api.spotify.com"],
			fontSrc: ["'self'", "https://*.gstatic.com"],
			frameSrc: ["'self'", "https://*.google.com"],
			imgSrc: ["'self'", "data:", "https://i.scdn.co"],
			manifestSrc: ["'self'"],
			mediaSrc: ["'none'"],
			workerSrc: ["'self'"],
		},
	});
};

export default defineConfig(async ({ mode }) => ({
	plugins: [
		reactSwc(),
		tsconfigPaths(),
		imagetools(),
		checker(checkerOptions),
		html({ "VITE_CONTENT_SECURITY_POLICY": determineContentSecurityPolicy(mode) }),
	],
	server: {
		host: true,
		https: {
			cert: await readFile("/home/op/.certificates/localhost.pem"),
			key: await readFile("/home/op/.certificates/localhost-key.pem"),
		},
	},
}));
