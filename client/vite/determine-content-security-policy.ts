import contentSecurityPolicyBuilder from "content-security-policy-builder";

export const determineContentSecurityPolicy = (mode: string) => {
	const isProduction = mode === "production";

	return contentSecurityPolicyBuilder({
		directives: {
			defaultSrc: ["'self'"],
			scriptSrc: [
				"'self'",
				"https://*.google.com",
				"https://*.gstatic.com",
				"https://*.googleapis.com",
				"https://sdk.scdn.co",
				isProduction ? "" : "'unsafe-inline'",
			],
			styleSrc: ["'self'", isProduction ? "" : "'unsafe-inline'", " https://*.googleapis.com"],
			objectSrc: ["'none'"],
			connectSrc: ["'self'", "https://accounts.spotify.com", "https://api.spotify.com"],
			fontSrc: ["'self'", "https://*.gstatic.com"],
			frameSrc: ["'self'", "https://*.google.com", "https://sdk.scdn.co"],
			imgSrc: ["'self'", "data:", "blob:", "https://i.scdn.co"],
			manifestSrc: ["'self'"],
			mediaSrc: ["'none'"],
			workerSrc: ["'self'"],
		},
	});
};
