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

	function seek(time: number) {
		if (!audioPlayer) return;
		audioPlayer.currentTime = time;
	}

	function playNextTrack() {
		if (!audioPlayer) return;
		audioPlayer.src = getRandomTrack();
		audioPlayer.play();
		radioState.isPlaying = true;
	}

	$effect(() => {
		radioState.toggle = togglePlay;
		radioState.seek = seek;
	});

	$effect(() => {
		if (!audioPlayer) return;

		audioPlayer.src = getRandomTrack();

		const onTimeUpdate = () => (radioState.currentTime = audioPlayer!.currentTime);
		const onLoadedMetadata = () => (radioState.duration = audioPlayer!.duration);
		const onEnded = () => {
			radioState.isPlaying = false;
			radioState.currentTime = 0;
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

<audio bind:this={audioPlayer}></audio>
