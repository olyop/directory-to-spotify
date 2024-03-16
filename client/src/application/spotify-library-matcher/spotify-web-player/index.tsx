import { ArrowPathIcon, BackwardIcon, ForwardIcon, PauseIcon, PlayIcon } from "@heroicons/react/24/outline";
import { FC, createElement, useCallback, useEffect } from "react";
import {
	WebPlaybackSDK,
	usePlaybackState,
	usePlayerDevice,
	useSpotifyPlayer,
	useWebPlaybackSDKReady,
} from "react-spotify-web-playback-sdk";
import { Devices } from "spotify-types";

import { Button } from "../../../components/button";
import { useSpotify } from "../../../packages/spotify-web-api-react";
import { useAppSelector } from "../../store";

export const SpotifyWebPlayerInternal: FC = () => {
	const { client } = useSpotify();

	const nowPlaying = useAppSelector(
		state => state.workItems.nowPlaying,
		(left, right) => left === right,
	);

	const player = useSpotifyPlayer();
	const playerDevice = usePlayerDevice();
	const playbackState = usePlaybackState(true, 1000);
	const webPlaybackSDKReady = useWebPlaybackSDKReady();

	const handlePrevious = () => {
		if (!player || !webPlaybackSDKReady) return;

		void player.previousTrack();
	};

	const handlePause = () => {
		if (!player || !webPlaybackSDKReady) return;

		void player.togglePlay();
	};

	const handleNext = () => {
		if (!player || !webPlaybackSDKReady) return;

		void player.nextTrack();
	};

	const handleTransferPlayback = async () => {
		if (!player || !playerDevice || !nowPlaying) return;

		const deviceIDS = await client.query<Devices>("GET", "me/player/devices");

		if (!deviceIDS.devices.some(device => device.is_active)) {
			await client.query("PUT", "me/player", {
				body: {
					device_ids: [playerDevice.device_id],
					play: true,
				},
			});
		}

		await player.connect();

		await client.query("PUT", "me/player/play", {
			body: {
				uris: [`spotify:track:${nowPlaying}`],
			},
		});

		if (playbackState?.paused) {
			await player.resume();
		}
	};

	useEffect(() => {
		if (!player || !webPlaybackSDKReady || !nowPlaying) return;

		void handleTransferPlayback();
	}, [webPlaybackSDKReady, nowPlaying, player]);

	return (
		<div className="border-spotify-hover flex flex-col overflow-hidden rounded-2xl border">
			{playbackState?.track_window.current_track.album.images[0]?.url ? (
				<img
					alt="Album cover"
					className="aspect-square w-full bg-black"
					src={playbackState.track_window.current_track.album.images[0].url}
				/>
			) : (
				<div className="aspect-square w-full bg-black" />
			)}
			<div className="border-b-spotify-hover border-b p-2">
				<h3 className="truncate text-center">{playbackState?.track_window.current_track.name ?? "Not selected"}</h3>
				<p className="truncate text-center text-sm text-gray-500">
					{playbackState?.track_window.current_track.artists
						.reduce((content, artist) => `${content}, ${artist.name}`, "")
						.slice(2) ?? "Not selected"}
				</p>
			</div>
			<div className="flex items-center justify-center gap-2 p-2">
				<Button
					transparent
					ariaLabel="Previous"
					className="border-0"
					onClick={handlePrevious}
					leftIcon={className => <BackwardIcon className={className} />}
				/>
				<Button
					ariaLabel="Play"
					className="border-0"
					onClick={handlePause}
					leftIcon={className =>
						playbackState?.loading ? (
							<ArrowPathIcon className={`animate-spin ${className}`} />
						) : playbackState?.paused ? (
							<PlayIcon className={className} />
						) : (
							<PauseIcon className={className} />
						)
					}
				/>
				<Button
					transparent
					ariaLabel="Next"
					className="border-0"
					onClick={handleNext}
					leftIcon={className => <ForwardIcon className={className} />}
				/>
			</div>
		</div>
	);
};

export const SpotifyWebPlayer: FC = () => {
	const { client } = useSpotify();

	const getOAuthToken = useCallback((callback: (accessToken: string) => void) => {
		callback(client.token?.accessToken ?? "");
	}, []);

	return (
		<WebPlaybackSDK initialDeviceName={document.title} getOAuthToken={getOAuthToken}>
			<SpotifyWebPlayerInternal />
		</WebPlaybackSDK>
	);
};
