class IdleState {
	idle = $state(false);
	#timer: ReturnType<typeof setTimeout> | undefined;

	start(timeoutMs = 5000) {
		if (typeof window === 'undefined') return;

		const reset = () => {
			this.idle = false;
			clearTimeout(this.#timer);
			this.#timer = setTimeout(() => {
				this.idle = true;
			}, timeoutMs);
		};

		for (const event of ['pointermove', 'keydown', 'wheel', 'touchstart']) {
			window.addEventListener(event, reset, { passive: true });
		}

		reset();
	}
}

export const idleState = new IdleState();
