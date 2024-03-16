import {
	Bars3Icon,
	ChevronDoubleLeftIcon,
	HomeIcon,
	InformationCircleIcon,
	XMarkIcon,
} from "@heroicons/react/24/outline";
import { FC, ReactNode, createElement, useState } from "react";
import { NavLink } from "react-router-dom";

import logo from "../../assets/logo.png";
import { ClassNameProps } from "../../props";
import { AccountButton } from "../account-button";
import { Button } from "../button";
import { Elevated } from "../elevated";
import { ShareButton } from "../share-button";
import { getSidebarOpen, saveSidebarOpen } from "./page-local-storage";

export const Page: FC<PageProps> = ({
	menuNode = null,
	contentNode,
	asideHeaderNode,
	asideNode = null,
	controlsNode = null,
	menuClassName = "",
	contentClassName = "",
	asideHeaderClassName = "",
	asideClassName = "",
	controlsClassName = "",
}) => {
	const [isSidebarOpen, setSidebarOpen] = useState(getSidebarOpen());
	const [isAsideOpen, setAsideOpen] = useState(true);

	const handleSidebarToggle = () => {
		setSidebarOpen(prevState => {
			const newState = !prevState;

			saveSidebarOpen(newState);

			return newState;
		});
	};

	const handleAsideToggle = () => {
		setAsideOpen(prevState => !prevState);
	};

	const gridColumnsClassName =
		isSidebarOpen && isAsideOpen
			? "grid-cols-[24rem,1fr,24rem]"
			: isSidebarOpen && !isAsideOpen
				? "grid-cols-[24rem,1fr,6rem]"
				: !isSidebarOpen && isAsideOpen
					? "grid-cols-[15rem,1fr,24rem]"
					: "grid-cols-[15rem,1fr,6rem]";

	return (
		<div className="grid size-full grid-rows-[1fr,8rem] p-2">
			<div className={`h-content-height grid ${gridColumnsClassName}`}>
				<Elevated className="h-content-height min-w-0" contentClassName="flex flex-col gap-6 pr-4 justify-between">
					<div className="flex flex-col gap-6">
						<div className="flex items-center gap-2 overflow-hidden">
							<Button
								transparent
								onClick={handleSidebarToggle}
								ariaLabel={isSidebarOpen ? "Expand" : "Collapse"}
								leftIcon={className => <Bars3Icon className={className} />}
							/>
							<a
								href={window.location.origin}
								aria-label="Directory to Spotify"
								className="hover:bg-spotify-hover flex items-center gap-4 whitespace-nowrap rounded-2xl p-2"
							>
								<img src={logo} alt="Directory to Spotify logo" className="size-8" />
								{isSidebarOpen ? <span className="mt-[-2px] text-2xl lowercase">{document.title}</span> : null}
							</a>
						</div>
						<nav className="overflow-y-auto overflow-x-hidden">
							<nav className="flex size-full flex-col gap-4">
								<NavLink to="/">
									{({ isActive }) => (
										<Button
											transparent
											text="Matcher"
											ariaLabel="Home Page"
											className={`size-full ${isActive ? "!bg-spotify-hover" : ""}`}
											leftIcon={className => <HomeIcon className={className} />}
										/>
									)}
								</NavLink>
								<NavLink to="/about">
									{({ isActive }) => (
										<Button
											transparent
											text="About"
											ariaLabel="About Page"
											className={`size-full ${isActive ? "!bg-spotify-hover" : ""}`}
											leftIcon={className => <InformationCircleIcon className={className} />}
										/>
									)}
								</NavLink>
								<ShareButton />
							</nav>
						</nav>
					</div>
					<div className="flex flex-col justify-end gap-4">
						<div className={`flex flex-col gap-4 ${menuClassName}`}>{menuNode}</div>
						<AccountButton />
					</div>
				</Elevated>
				<Elevated type="main" className="h-content-height min-w-0">
					<div className="size-full overflow-x-hidden overflow-y-scroll">
						<div className={`size-full pr-4 ${contentClassName}`}>{contentNode}</div>
					</div>
				</Elevated>
				<Elevated type="aside" className="h-content-height min-w-0" contentClassName="flex flex-col items-center gap-6">
					<div className="flex h-12 w-full items-center justify-between pr-4">
						{isAsideOpen ? <div className={`h-full ${asideHeaderClassName}`}>{asideHeaderNode}</div> : null}
						<Button
							transparent
							ariaLabel="Toggle aside"
							onClick={handleAsideToggle}
							text={isAsideOpen ? "Close" : undefined}
							rightIcon={className =>
								isAsideOpen ? <XMarkIcon className={className} /> : <ChevronDoubleLeftIcon className={className} />
							}
						/>
					</div>
					{isAsideOpen && (
						<div className="size-full overflow-y-auto overflow-x-hidden">
							<div className={`w-full pr-4 ${asideClassName}`}>{asideNode}</div>
						</div>
					)}
				</Elevated>
			</div>
			<Elevated type="footer" contentClassName={`flex items-center justify-between !px-8 gap-8 ${controlsClassName}`}>
				{controlsNode}
			</Elevated>
		</div>
	);
};

export interface PageProps extends ClassNameProps {
	menuNode?: ReactNode;
	contentNode: ReactNode;
	asideHeaderNode?: ReactNode;
	asideNode?: ReactNode;
	controlsNode?: ReactNode;
	menuClassName?: string;
	contentClassName?: string;
	asideHeaderClassName?: string;
	asideClassName?: string;
	controlsClassName?: string;
}
