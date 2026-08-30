import { browser } from '$app/environment';
import { layouts, mobileDisabledLayouts } from '$lib/layouts';

// Layout indices eligible to be picked, filtering out ones disabled on mobile.
function eligibleIndices(): number[] {
	const isMobile = browser && window.matchMedia('(max-width: 749px)').matches;
	return layouts
		.map((_, i) => i)
		.filter((i) => !isMobile || !mobileDisabledLayouts.includes(i));
}

function randomIndex(): number {
	if (!browser) return 0;
	const pool = eligibleIndices();
	return pool[Math.floor(Math.random() * pool.length)] ?? 0;
}

class LayoutState {
	// Randomized fresh on every page load, not persisted across reloads.
	index = $state(randomIndex());

	set(i: number) {
		this.index = i;
	}

	// Cycles to the next layout, skipping ones disabled on mobile.
	next() {
		const pool = eligibleIndices();
		const currentPos = pool.indexOf(this.index);
		const nextIndex = pool[(currentPos + 1) % pool.length] ?? 0;
		this.set(nextIndex);
	}
}

export const layoutState = new LayoutState();
