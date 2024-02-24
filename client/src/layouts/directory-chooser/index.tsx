import { FolderOpenIcon } from "@heroicons/react/20/solid";
import logoImagePath from "assets/logo.png";
import { BigButton } from "components/big-button";
import { FC } from "react";
import { OnClickOptions } from "types";

export const DirectoryChooser: FC<OnClickOptions> = ({ onClick }) => (
	<div className="flex flex-col h-full items-center justify-center gap-8">
		<img src={logoImagePath} className="h-16 w-16" />
		<h2 className="text-2xl font-bold text-center">Choose a directory</h2>
		<p className="text-center">To get started, please select a folder with audio files.</p>
		<BigButton
			ariaLabel="Choose"
			onClick={onClick}
			text="Choose"
			leftIcon={className => <FolderOpenIcon className={className} />}
		/>
	</div>
);
