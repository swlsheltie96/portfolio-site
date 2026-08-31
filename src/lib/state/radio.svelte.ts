class RadioState {
	isPlaying = $state(false);
	currentSongTitle = $state('');
	currentTime = $state(0);
	duration = $state(0);
	toggle: () => void = () => {};
	seek: (time: number) => void = () => {};
}

export const radioState = new RadioState();
