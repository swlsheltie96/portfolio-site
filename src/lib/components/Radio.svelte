<script lang="ts">
	import { radioState } from '$lib/state/radio.svelte';

	const tracks = [
		{ title: 'Pawky', file: 'pawky.mp3' },
		{ title: 'Just One of Those Things', file: 'just-one-of-those-things.mp3' },
		{ title: 'Bass Suite – Sweet Bass', file: 'bass-suite-sweet-bass.mp3' },
		{ title: 'Monkey Billiards', file: 'monkey-billiards.mp3' },
		{ title: 'Jazz et Jazz', file: 'jazz-et-jazz.mp3' },
		{ title: "Duke's Theme", file: 'dukes-theme.mp3' },
	];

	let audioPlayer: HTMLAudioElement | undefined = $state();
	let currentTime = $state(0);
	let duration = $state(0);

	function getRandomTrack() {
		const track = tracks[Math.floor(Math.random() * tracks.length)];
		radioState.currentSongTitle = track.title;
		return `/audio/${track.file}`;
	}

	function togglePlay() {
		if (!audioPlayer) return;

		if (radioState.isPlaying) {
			audioPlayer.pause();
		} else {
			audioPlayer.play();
		}
		radioState.isPlaying = !radioState.isPlaying;
	}

	function handleSeek() {
		if (!audioPlayer) return;
		audioPlayer.currentTime = currentTime;
	}

	function formatTime(seconds: number) {
		const mins = Math.floor(seconds / 60);
		const secs = Math.floor(seconds % 60);
		return `${mins}:${secs.toString().padStart(2, '0')}`;
	}

	function playNextTrack() {
		if (!audioPlayer) return;
		audioPlayer.src = getRandomTrack();
		audioPlayer.play();
		radioState.isPlaying = true;
	}

	$effect(() => {
		radioState.toggle = togglePlay;
	});

	$effect(() => {
		if (!audioPlayer) return;

		audioPlayer.src = getRandomTrack();

		const onTimeUpdate = () => (currentTime = audioPlayer!.currentTime);
		const onLoadedMetadata = () => (duration = audioPlayer!.duration);
		const onEnded = () => {
			radioState.isPlaying = false;
			currentTime = 0;
			playNextTrack();
		};

		audioPlayer.addEventListener('timeupdate', onTimeUpdate);
		audioPlayer.addEventListener('loadedmetadata', onLoadedMetadata);
		audioPlayer.addEventListener('ended', onEnded);

		return () => {
			audioPlayer?.removeEventListener('timeupdate', onTimeUpdate);
			audioPlayer?.removeEventListener('loadedmetadata', onLoadedMetadata);
			audioPlayer?.removeEventListener('ended', onEnded);
		};
	});
</script>

<div class="radio">
	<div class="component-title text-body">Radio</div>

	<div class="radio">
		<audio bind:this={audioPlayer}></audio>
		<div class="radio-controls">
			<button class="play-pause text-body" onclick={togglePlay}>
				{radioState.isPlaying ? 'pause' : 'play'}
			</button>
			<span class="text-body track-title">{radioState.currentSongTitle}</span>
			<div class="timeline">
				<input
					type="range"
					bind:value={currentTime}
					max={duration}
					step="0.1"
					oninput={handleSeek}
				/>
			</div>
			<div class="duration text-body">
				{formatTime(currentTime)} / {formatTime(duration)}
			</div>
		</div>
	</div>
</div>

<style>
	.radio-controls {
		display: flex;
		align-items: center;
		gap: var(--spacing);
	}

	.play-pause {
		text-transform: uppercase;
		cursor: pointer;
	}

	.timeline {
		flex-grow: 1;
	}

	.timeline input[type='range'] {
		width: 100%;
		cursor: pointer;
		-webkit-appearance: none;
		background: transparent;
	}

	.timeline input[type='range']::-webkit-slider-thumb {
		-webkit-appearance: none;
		height: 10px;
		width: 10px;
		border-radius: 50%;
		background: black;
		cursor: pointer;
	}

	.timeline input[type='range']::-moz-range-thumb {
		height: 10px;
		width: 10px;
		border-radius: 50%;
		background: black;
		cursor: pointer;
	}

	.timeline input[type='range']::-webkit-slider-runnable-track {
		width: 100%;
		border-radius: 2px;
	}

	.timeline input[type='range']::-moz-range-track {
		width: 100%;
		border-radius: 2px;
	}
</style>
