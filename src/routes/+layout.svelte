<script lang="ts">
	import favicon from '$lib/assets/favicon.png';
	import EffectsProvider from '$lib/components/effects/EffectsProvider.svelte';
	import BrushCanvas from '$lib/components/effects/BrushCanvas.svelte';
	import MirrorOverlay from '$lib/components/effects/MirrorOverlay.svelte';
	import ClearOverlay from '$lib/components/effects/ClearOverlay.svelte';
	import Navbar from '$lib/components/Navbar.svelte';
	import PageGrid from '$lib/components/PageGrid.svelte';
	import '$lib/styles/global.css';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<EffectsProvider />
<BrushCanvas />
<MirrorOverlay />
<ClearOverlay />

<PageGrid>
	<Navbar />

	{@render children()}
</PageGrid>
