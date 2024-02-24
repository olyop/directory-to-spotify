/// <reference lib="WebWorker" />
import { clientsClaim } from "workbox-core";
import { googleFontsCache, imageCache, offlineFallback, pageCache, staticResourceCache } from "workbox-recipes";

declare const self: ServiceWorkerGlobalScope;

// eslint-disable-next-line no-underscore-dangle
self.__WB_DISABLE_DEV_LOGS = true;

clientsClaim();

await self.skipWaiting();

pageCache();

googleFontsCache();

staticResourceCache();

imageCache({
	maxEntries: Number.POSITIVE_INFINITY,
	maxAgeSeconds: Number.POSITIVE_INFINITY,
});

offlineFallback({
	pageFallback: "index.html",
});
