<script lang="ts">
	import { radioState } from '$lib/state/radio.svelte';

	function handleSeek() {
		radioState.seek(radioState.currentTime);
	}

	function formatTime(seconds: number) {
		const mins = Math.floor(seconds / 60);
		const secs = Math.floor(seconds % 60);
		return `${mins}:${secs.toString().padStart(2, '0')}`;
	}
</script>

<div class="radio">
	<div class="component-title text-body">Radio</div>

	<div class="radio">
		<div class="radio-controls">
			<button class="play-pause text-body" onclick={() => radioState.toggle()}>
				{radioState.isPlaying ? 'pause' : 'play'}
			</button>
			<span class="text-body track-title">{radioState.currentSongTitle}</span>
			<div class="timeline">
				<input
					type="range"
					bind:value={radioState.currentTime}
					max={radioState.duration}
					step="0.1"
					oninput={handleSeek}
				/>
			</div>
			<div class="duration text-body">
				{formatTime(radioState.currentTime)} / {formatTime(radioState.duration)}
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
