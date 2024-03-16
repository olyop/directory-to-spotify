import { FolderIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { FC, Fragment, createElement, useEffect, useRef, useState } from "react";

import logoImagePath from "../../../assets/logo.png";
import { Button } from "../../../components/button";
import { Page } from "../../../components/page";
import { Loading } from "../../../pages/loading";
import { FileSystemReadDirectoryCustom } from "../../types";
import { fileSystemReadCustom } from "./file-system-read-custom";

export const DirectoryChooser: FC<DirectoryChooserProps> = ({ onChoose }) => {
	const abortControllerRef = useRef<AbortController>(new AbortController());

	const [isLoading, setIsLoading] = useState(false);
	const [errorText, setErrorText] = useState<string | null>(null);

	const handleOnDirectoryChosen = () => {
		setIsLoading(true);
	};

	const readDirectory = async () => {
		try {
			abortControllerRef.current = new AbortController();

			const fileSystem = await fileSystemReadCustom(abortControllerRef.current.signal, handleOnDirectoryChosen);

			if (fileSystem) {
				onChoose(fileSystem);
			} else {
				setErrorText("No directory chosen");
			}
		} catch (error) {
			setErrorText(error instanceof Error ? error.message : "Unknown error");
		} finally {
			setIsLoading(false);
		}
	};

	const handleDirectoryChoose = () => {
		void readDirectory();
	};

	const handleCancel = () => {
		abortControllerRef.current.abort(new Error("Cancelled"));
	};

	const handleCleanUp = () => {
		abortControllerRef.current = new AbortController();

		setIsLoading(false);
		setErrorText(null);
	};

	useEffect(() => {
		let timeout: ReturnType<typeof setTimeout> | null = null;

		if (errorText) {
			timeout = setTimeout(() => {
				setErrorText(null);
			}, 2000);
		}

		return () => {
			if (timeout) {
				clearTimeout(timeout);
			}
		};
	}, [errorText]);

	useEffect(
		() => () => {
			handleCancel();
			handleCleanUp();
		},
		[],
	);

	if (isLoading) {
		return (
			<Fragment>
				<Loading
					text="Reading..."
					controlsNode={
						<Button
							text="Cancel"
							ariaLabel="Cancel"
							onClick={handleCancel}
							leftIcon={className => <XMarkIcon className={className} />}
						/>
					}
				/>
			</Fragment>
		);
	}

	return (
		<Page
			contentClassName="flex flex-col items-center justify-center gap-8"
			contentNode={
				<Fragment>
					<img src={logoImagePath} className="size-16" alt="Spotify" />
					<h2 className="text-center text-2xl font-bold">Choose a directory to get started!</h2>
				</Fragment>
			}
			controlsClassName="!justify-end"
			controlsNode={
				<Fragment>
					{errorText && <p className="text-red-500">{errorText}</p>}
					<Button
						text="Choose"
						ariaLabel="Choose a directory"
						onClick={handleDirectoryChoose}
						leftIcon={className => <FolderIcon className={className} />}
					/>
				</Fragment>
			}
		/>
	);
};

export type DirectoryChooserOnChooseProp = (fileSystem: FileSystemReadDirectoryCustom) => void;

export interface DirectoryChooserProps {
	onChoose: DirectoryChooserOnChooseProp;
}
