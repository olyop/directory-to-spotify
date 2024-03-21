import { DBSchema, IDBPDatabase, openDB } from "idb";
import pLimit from "p-limit";

import { WorkItem, WorkItemFile } from "../types";
import { convertWorkItemFiles, convertWorkItems } from "./helpers";

export class DatabaseManager {
	#NAME = "directory-to-spotify" as const;
	#WORK_ITEM_STORE_NAME = "work_item" as const;
	#WORK_ITEM_FILE_STORE_NAME = "work_item_file" as const;
	#OPTIONS: DatabaseManagerOptions;

	#database: IDBPDatabaseCustom | null = null;

	constructor(options: DatabaseManagerOptions) {
		this.#OPTIONS = options;

		void this.#handleOpen();
	}

	get database() {
		if (!this.#database) throw new Error("Database not ready");

		return this.#database;
	}

	async retrieveWorkItems() {
		const workItems = await this.database.getAll(this.#WORK_ITEM_STORE_NAME);

		return workItems.length === 0 ? null : convertWorkItems(workItems);
	}

	async retrieveWorkItemFiles() {
		const workItemFiles = await this.database.getAll(this.#WORK_ITEM_FILE_STORE_NAME);

		return workItemFiles.length === 0 ? null : convertWorkItemFiles(workItemFiles);
	}

	async retrieveWorkItem(id: string) {
		const workItem = await this.database.get(this.#WORK_ITEM_STORE_NAME, id);

		return workItem ?? null;
	}

	async retrieveWorkItemFile(id: string) {
		const workItemFile = await this.database.get(this.#WORK_ITEM_FILE_STORE_NAME, id);

		return workItemFile ?? null;
	}

	async saveWorkItem(workItem: WorkItem) {
		await this.database.put(this.#WORK_ITEM_STORE_NAME, workItem);
	}

	async saveWorkItemFiles(workItemFiles: WorkItemFile[]) {
		const awaitables: Promise<string>[] = [];

		const transaction = this.database.transaction(this.#WORK_ITEM_FILE_STORE_NAME, "readwrite", {
			durability: "strict",
		});

		const objectStore = transaction.objectStore(this.#WORK_ITEM_FILE_STORE_NAME);

		const limit = pLimit(20);

		for (const workItemFile of workItemFiles) {
			awaitables.push(limit(() => objectStore.put(workItemFile)));
		}

		await Promise.all(awaitables);

		await transaction.done;
	}

	async clearWorkItems() {
		await this.database.clear(this.#WORK_ITEM_STORE_NAME);
		await this.database.clear(this.#WORK_ITEM_FILE_STORE_NAME);
	}

	async clearWorkItemsMatch() {
		const transaction = this.database.transaction(this.#WORK_ITEM_STORE_NAME, "readwrite", {
			durability: "strict",
		});

		const objectStore = transaction.objectStore(this.#WORK_ITEM_STORE_NAME);

		const workItems = await objectStore.getAll();
		const limit = pLimit(20);
		const input = workItems.map(workItem => limit(() => objectStore.put({ ...workItem, match: null })));

		await Promise.all(input);

		await transaction.done;
	}

	close() {
		this.#database?.close();
	}

	async #handleOpen() {
		const value = await openDB<DatabaseSchema>(this.#NAME, 1, {
			upgrade: result => {
				this.#handleUpgrade(result);
			},
		});

		this.#database = value;

		this.#OPTIONS.onReady?.();
	}

	#handleUpgrade(result: IDBPDatabaseCustom) {
		result.createObjectStore(this.#WORK_ITEM_STORE_NAME, { keyPath: "id" });
		result.createObjectStore(this.#WORK_ITEM_FILE_STORE_NAME, { keyPath: "id" });
	}
}

interface DatabaseSchema extends DBSchema {
	"work_item": {
		key: string;
		value: WorkItem;
	};
	"work_item_file": {
		key: string;
		value: WorkItemFile;
	};
}

type IDBPDatabaseCustom = IDBPDatabase<DatabaseSchema>;

export interface DatabaseManagerOptions {
	onReady?: () => void;
}
