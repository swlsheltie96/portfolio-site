class RadioState {
	isPlaying = $state(false);
	currentSongTitle = $state('');
	toggle: () => void = () => {};
}

export const radioState = new RadioState();
