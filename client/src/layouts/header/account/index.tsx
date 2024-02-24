import { ArrowTopRightOnSquareIcon, UserCircleIcon } from "@heroicons/react/20/solid";
import defaultProfileImage from "assets/default-profile.png";
import spotifyLogoImage from "assets/spotify-logo.png";
import { Button } from "components/button";
import { Modal } from "components/modal";
import { SpotifyLogInOutButton } from "components/spotify-log-in-out-button";
import { useModal } from "hooks/use-modal";
import { useSpotify } from "packages/spotify-web-api-react";
import { FC, Fragment } from "react";

import { HeaderAccountButton } from "./button";

export const HeaderAccount: FC = () => {
	const { isAuthenticated, user } = useSpotify();

	const [isModalOpen, openModal, closeModal] = useModal();

	return (
		<Fragment>
			<HeaderAccountButton isAuthenticated={isAuthenticated} user={user} onClick={openModal} />
			<Modal
				isOpen={isModalOpen}
				onClose={closeModal}
				title="Account"
				icon={className => <UserCircleIcon className={className} />}
				contentClassName="flex flex-col gap-6 items-center !py-8"
			>
				<img
					src={isAuthenticated ? user?.photoUrl ?? defaultProfileImage : spotifyLogoImage}
					className="w-24 h-24 rounded-full"
				/>
				{isAuthenticated === true ? (
					<Fragment>
						<h2 className="text-3xl font-bold text-center">{user?.name ?? "Loading..."}</h2>
						<p className="text-center">{user?.emailAddress ?? "Loading..."}</p>
						<a className="text-underline" href={user?.spotifyUrl} target="_blank" rel="noreferrer">
							<Button
								text="Open Profile"
								ariaLabel="Open Profile"
								leftIcon={className => <img src={spotifyLogoImage} className={className} />}
								rightIcon={className => <ArrowTopRightOnSquareIcon className={className} />}
							/>
						</a>
					</Fragment>
				) : (
					<p className="text-center">To get started, please log in to your Spotify account.</p>
				)}
				<SpotifyLogInOutButton isLogin={isAuthenticated !== true} onClick={closeModal} />
			</Modal>
		</Fragment>
	);
};
