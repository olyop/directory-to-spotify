/// <reference types="vite/client" />

// eslint-disable-next-line unicorn/prevent-abbreviations
interface ImportMetaEnv {
	readonly VITE_SPOTIFY_CLIENT_ID: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
