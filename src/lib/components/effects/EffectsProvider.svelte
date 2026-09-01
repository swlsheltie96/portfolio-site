<script lang="ts">
	import { onMount } from 'svelte';
	import { idleState } from '$lib/state/idle.svelte';
	import { visibilityState } from '$lib/state/visibility.svelte';
	import { viewportState } from '$lib/state/viewport.svelte';

	let { idleTimeoutMs = 5000 }: { idleTimeoutMs?: number } = $props();

	// The grid column widths in grid.css are computed from 100vw, which
	// includes the browser's reserved scrollbar width (when not overlaid) —
	// wider than the actual visible content area. Exposing the real
	// scrollbar width lets those formulas subtract it back out.
	function setScrollbarWidth() {
		const width = window.innerWidth - document.documentElement.clientWidth;
		document.documentElement.style.setProperty('--scrollbar-width', `${width}px`);
	}

	onMount(() => {
		idleState.start(idleTimeoutMs);
		visibilityState.start();
		viewportState.start();

		setScrollbarWidth();
		window.addEventListener('resize', setScrollbarWidth);
		return () => window.removeEventListener('resize', setScrollbarWidth);
	});
</script>
