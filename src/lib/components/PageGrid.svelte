<script lang="ts">
	import { brushState } from '$lib/state/brush.svelte';
	import { clearState } from '$lib/state/clear.svelte';

	let { children } = $props();
</script>

<div
	class="grid page-grid"
	class:drawing={brushState.active}
	class:cleared={clearState.active}
>
	{@render children()}
</div>

<style>
	.page-grid {
		min-height: 100vh;
		width: calc(100% - var(--spacing) * 1);
		margin-left: var(--spacing);
		margin-top: var(--spacing);
		padding-bottom: var(--spacing);

		display: flex;
		flex-wrap: wrap;
		align-items: flex-start;
		gap: 0 var(--spacing);
	}

	.page-grid.drawing {
		pointer-events: none;
	}

	/* Target the content children (not .page-grid itself), since <Navbar>
	   is also a direct child here and shouldn't fade along with the page. */
	:global(.page-grid > .component),
	:global(.page-grid > .spacer),
	:global(.page-grid > .group) {
		opacity: 1;
		transition: opacity 1000ms;
	}

	:global(.page-grid.cleared > .component),
	:global(.page-grid.cleared > .spacer),
	:global(.page-grid.cleared > .group) {
		opacity: 0;
		pointer-events: none;
	}
</style>
