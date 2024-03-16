import { ArrowTopRightOnSquareIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { FC, Fragment, createElement } from "react";

import spotifyLogoImage from "../../assets/spotify-logo.png";
import { useModal } from "../../hooks/use-modal";
import { useSpotify } from "../../packages/spotify-web-api-react";
import { Button } from "../button";
import { Modal } from "../modal";
import { SpotifyLogInOutButton } from "../spotify-log-in-out-button";

export const AccountButton: FC = () => {
	const { isAuthenticated, user } = useSpotify();

	const [isModalOpen, openModal, closeModal] = useModal();

	return (
		<Fragment>
			<Button
				transparent
				onClick={openModal}
				disabled={!isAuthenticated}
				ariaLabel={user?.name ?? "Account"}
				text={user?.name ?? "Account"}
				leftIcon={className =>
					user?.photoUrl ? (
						<img className={`rounded-full ${className}`} src={user.photoUrl} alt="Spotify User Account" />
					) : (
						<UserCircleIcon className={className} />
					)
				}
			/>
			<Modal
				title="Account"
				isOpen={isModalOpen}
				onClose={closeModal}
				icon={className => <UserCircleIcon className={className} />}
				contentClassName="flex flex-col gap-6 items-center !py-8"
			>
				<img
					className="h-24 w-24 rounded-full"
					alt={`${user?.name ?? "Loading..."} - my profile`}
					src={user ? user.photoUrl : spotifyLogoImage}
				/>
				{isAuthenticated ? (
					<Fragment>
						<h2 className="text-center text-3xl font-bold">{user?.name ?? "Loading..."}</h2>
						<p className="text-center">{user?.emailAddress ?? "Loading..."}</p>
						<a className="text-underline" href={user?.spotifyUrl} target="_blank" rel="noreferrer">
							<Button
								text="Open Profile"
								ariaLabel="Open Profile"
								leftIcon={className => <img src={spotifyLogoImage} className={className} alt="Spotify Logo" />}
								rightIcon={className => <ArrowTopRightOnSquareIcon className={className} />}
							/>
						</a>
					</Fragment>
				) : (
					<p className="text-center">To get started, please log in to your Spotify account.</p>
				)}
				<SpotifyLogInOutButton isLogin={!isAuthenticated} onClick={closeModal} />
			</Modal>
		</Fragment>
	);
};
