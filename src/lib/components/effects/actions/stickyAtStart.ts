import type { Action } from 'svelte/action';

// Makes an element sticky at whatever position it's already rendered at,
// instead of requiring a hardcoded `top` value that may not match its
// natural position (which would cause a visible jump once it starts sticking).
const MOBILE_QUERY = '(max-width: 749px)';

export const stickyAtStart: Action<HTMLElement, boolean | undefined> = (node, enabled) => {
	let isEnabled = enabled;

	const apply = () => {
		// Below the mobile breakpoint, components stack full-width — sticking a
		// full-width sidebar would pin a near-viewport-height empty block at
		// the top of the page, so sticky is disabled there entirely.
		if (!isEnabled || mediaQuery.matches) {
			node.style.position = '';
			node.style.top = '';
			return;
		}

		// Deferred to the next frame: this can fire while a reactive update is
		// still mid-flight (e.g. `layoutState.index` switching right after
		// mount, reusing this node for a different slot/component via an
		// unkeyed #each), and measuring immediately can capture a stale
		// position from before the browser finishes that layout pass.
		requestAnimationFrame(() => {
			if (!isEnabled || mediaQuery.matches) return;

			const top = node.getBoundingClientRect().top;
			node.style.position = 'sticky';
			node.style.top = `${top}px`;
		});
	};

	const mediaQuery = window.matchMedia(MOBILE_QUERY);
	apply();
	mediaQuery.addEventListener('change', apply);

	return {
		update(newEnabled) {
			isEnabled = newEnabled;
			apply();
		},
		destroy() {
			mediaQuery.removeEventListener('change', apply);
		}
	};
};
