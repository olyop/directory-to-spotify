import { SpotifyContextIsAuthenticated, SpotifyContextUser } from "spotify-web-api-react/types";

export const determineButtonValueFromStatus =
	(isAuthenticated: SpotifyContextIsAuthenticated, user: SpotifyContextUser) =>
	(landing: string, loading: string, done: string | undefined, error: string) => {
		if (isAuthenticated === false) {
			return error;
		} else if (isAuthenticated === true) {
			if (user) {
				return done ?? loading;
			} else {
				return loading;
			}
			// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
		} else if (isAuthenticated === null) {
			return landing;
		} else {
			throw new RangeError("Invalid value for isAuthenticated");
		}
	};
