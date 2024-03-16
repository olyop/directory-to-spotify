/* eslint-disable unicorn/prevent-abbreviations */
import { CacheProvider } from "./types";

export class IndexedDbCacheProvider implements CacheProvider {
	#database: IDBDatabase | null = null;

	#databaseName: string;
	#storeName: string;

	constructor(databaseName = "spotify-web-api", storeName = "cache") {
		this.#databaseName = databaseName;
		this.#storeName = storeName;
	}

	get isReady() {
		return this.#database !== null;
	}

	async initialize() {
		await navigator.storage.persist();

		await new Promise<void>((resolve, reject) => {
			const query = indexedDB.open(this.#databaseName);

			query.addEventListener("error", () => {
				reject(new Error(query.error?.message));
			});

			query.addEventListener("upgradeneeded", () => {
				query.result.createObjectStore(this.#storeName);
			});

			query.addEventListener("success", () => {
				this.#database = query.result;
				resolve();
			});
		});
	}

	get(key: string) {
		return new Promise<string | null>((resolve, reject) => {
			const database = this.#handleDatabase();

			const transaction = database.transaction(this.#storeName, "readonly");
			const store = transaction.objectStore(this.#storeName);

			const query = store.get(key);

			query.addEventListener("error", () => {
				reject(new Error(query.error?.message));
			});

			query.addEventListener("success", () => {
				resolve(query.result === undefined ? null : JSON.stringify(query.result));
			});
		});
	}

	async set(key: string, value: string) {
		await navigator.storage.persist();

		await new Promise<void>((resolve, reject) => {
			const database = this.#handleDatabase();

			const transaction = database.transaction(this.#storeName, "readwrite");
			const store = transaction.objectStore(this.#storeName);

			const query = store.put(JSON.parse(value), key);

			query.addEventListener("error", () => {
				reject(new Error(transaction.error?.message));
			});

			query.addEventListener("success", () => {
				resolve();
			});
		});

		return value;
	}

	remove(key: string) {
		return new Promise<string | null>((resolve, reject) => {
			const database = this.#handleDatabase();

			const transaction = database.transaction(this.#storeName, "readwrite");
			const store = transaction.objectStore(this.#storeName);

			const query = store.delete(key);

			query.addEventListener("error", () => {
				reject(new Error(query.error?.message));
			});

			query.addEventListener("success", () => {
				resolve((query.result as unknown as string | undefined) ?? null);
			});
		});
	}

	clear() {
		return new Promise<void>((resolve, reject) => {
			const database = this.#handleDatabase();

			const transaction = database.transaction(this.#storeName, "readwrite");
			const store = transaction.objectStore(this.#storeName);

			const query = store.clear();

			query.addEventListener("error", () => {
				reject(new Error(query.error?.message));
			});

			query.addEventListener("complete", () => {
				resolve();
			});
		});
	}

	#handleDatabase() {
		if (this.#database === null) {
			throw new Error("The IndexedDbCacheProvider has not been initialized");
		}

		return this.#database;
	}
}

export type OnReady = () => void;
