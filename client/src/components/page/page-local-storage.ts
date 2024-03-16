const LOCAL_STORAGE_KEY = "directory-to-spotify";

const SIDEBAR_OPEN_LOCAL_STORAGE_KEY = `${LOCAL_STORAGE_KEY}-sidebar-open`;

export const getSidebarOpen = () => {
	const value = localStorage.getItem(SIDEBAR_OPEN_LOCAL_STORAGE_KEY);
	return value ? (JSON.parse(value) as boolean) : true;
};

export const saveSidebarOpen = (isOpen: boolean) => {
	localStorage.setItem(SIDEBAR_OPEN_LOCAL_STORAGE_KEY, JSON.stringify(isOpen));
};
