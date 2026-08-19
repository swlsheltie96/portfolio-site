class MirrorState {
	active = $state(false);

	toggle() {
		this.active = !this.active;
	}
}

export const mirrorState = new MirrorState();
