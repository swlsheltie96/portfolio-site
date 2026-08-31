<script lang="ts">
	import { onMount } from 'svelte';
	import { idleState } from '$lib/state/idle.svelte';
	import { visibilityState } from '$lib/state/visibility.svelte';
	import { viewportState } from '$lib/state/viewport.svelte';

	let { idleTimeoutMs = 5000 }: { idleTimeoutMs?: number } = $props();

	onMount(() => {
		idleState.start(idleTimeoutMs);
		visibilityState.start();
		viewportState.start();
	});
</script>
