import { createContext } from "react";

import { AppStores } from ".";

export const StoresContext = createContext<AppStores>(null as unknown as AppStores);
