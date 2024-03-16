import { useContext } from "react";

import { DatabaseManagerContext } from "./context";

export const useDatabaseManager = () => useContext(DatabaseManagerContext);
