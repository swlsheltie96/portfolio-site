import { browser } from '$app/environment';
import { layouts, mobileDisabledLayouts } from '$lib/layouts';

const STORAGE_KEY = 'layout-index';

function loadInitialIndex(): number {
	if (!browser) return 0;
	const stored = Number(localStorage.getItem(STORAGE_KEY));
	return Number.isInteger(stored) && stored >= 0 && stored < layouts.length ? stored : 0;
}

class LayoutState {
	index = $state(loadInitialIndex());

	set(i: number) {
		this.index = i;
		if (browser) localStorage.setItem(STORAGE_KEY, String(i));
	}

	// Cycles to the next layout, skipping ones disabled on mobile.
	next() {
		const isMobile = browser && window.matchMedia('(max-width: 749px)').matches;
		const pool = layouts
			.map((_, i) => i)
			.filter((i) => !isMobile || !mobileDisabledLayouts.includes(i));
		const currentPos = pool.indexOf(this.index);
		const nextIndex = pool[(currentPos + 1) % pool.length] ?? 0;
		this.set(nextIndex);
	}
}

export const layoutState = new LayoutState();
