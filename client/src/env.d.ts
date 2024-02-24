/// <reference types="vite/client" />
/// <reference types="vite-plugin-comlink/client" />

// eslint-disable-next-line unicorn/prevent-abbreviations
interface ImportMetaEnv {
	readonly VITE_SPOTIFY_CLIENT_ID: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
