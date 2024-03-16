import { FC, PropsWithChildren, createElement } from "react";

import defaultProfileImagePath from "../../assets/default-profile.png";
import { spotify } from "../../clients/spotify";
import { SpotifyWebApiReactProvider as SpotifyProviderInternal } from "../../packages/spotify-web-api-react";

export const SpotifyProvider: FC<PropsWithChildren> = ({ children }) => (
	<SpotifyProviderInternal
		client={spotify}
		options={{
			defaultProfileImagePath,
		}}
	>
		{children}
	</SpotifyProviderInternal>
);
