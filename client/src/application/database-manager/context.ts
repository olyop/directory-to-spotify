import { createContext } from "react";

import { DatabaseManager } from ".";

export const DatabaseManagerContext = createContext<DatabaseManager>(null as unknown as DatabaseManager);
