<script lang="ts">
	import { onMount } from 'svelte';
	import { idleState } from '$lib/state/idle.svelte';
	import { visibilityState } from '$lib/state/visibility.svelte';

	let { idleTimeoutMs = 5000 }: { idleTimeoutMs?: number } = $props();

	onMount(() => {
		idleState.start(idleTimeoutMs);
		visibilityState.start();
	});
</script>
