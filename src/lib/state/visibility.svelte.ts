class VisibilityState {
	hidden = $state(false);

	start() {
		if (typeof document === 'undefined') return;

		this.hidden = document.hidden;
		document.addEventListener('visibilitychange', () => {
			this.hidden = document.hidden;
		});
	}
}

export const visibilityState = new VisibilityState();
