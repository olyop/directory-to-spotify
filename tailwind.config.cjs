/** @type {import('tailwindcss').Config} */

module.exports = {
	content: ["./src/**/*.{js,ts,jsx,tsx}"],
	plugins: [],
	theme: {
		extend: {
			colors: {
				primary: "#1db954",
				"primary-light": "#60ce87",
				"primary-dark": "#14813a",
			},
			height: {
				"header-height": "6rem",
				"content-height": "calc(100vh - 12rem)",
				"control-bar-height": "6rem",
			},
		},
	},
};
