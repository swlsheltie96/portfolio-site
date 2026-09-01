<script lang="ts">
	import favicon from '$lib/assets/favicon.png';
	import { page } from '$app/state';
	import EffectsProvider from '$lib/components/effects/EffectsProvider.svelte';
	import BrushCanvas from '$lib/components/effects/BrushCanvas.svelte';
	import MirrorOverlay from '$lib/components/effects/MirrorOverlay.svelte';
	import ClearOverlay from '$lib/components/effects/ClearOverlay.svelte';
	import RadioProvider from '$lib/components/RadioProvider.svelte';
	import Navbar from '$lib/components/Navbar.svelte';
	import PageGrid from '$lib/components/PageGrid.svelte';
	import '$lib/styles/global.css';

	let { children, data } = $props();

	const siteTitle = $derived(data.siteSettings?.title ?? 'SWL Studio');
	const siteDescription = $derived(
		data.siteSettings?.headerText ?? 'SWL Studio — design and creative work.'
	);
	const canonicalUrl = $derived(page.url.origin + page.url.pathname);
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>{siteTitle}</title>
	<meta name="description" content={siteDescription} />
	<link rel="canonical" href={canonicalUrl} />

	<meta property="og:type" content="website" />
	<meta property="og:site_name" content={siteTitle} />
	<meta property="og:title" content={siteTitle} />
	<meta property="og:description" content={siteDescription} />
	<meta property="og:url" content={canonicalUrl} />

	<meta name="twitter:card" content="summary" />
	<meta name="twitter:title" content={siteTitle} />
	<meta name="twitter:description" content={siteDescription} />

	<!-- Privacy-friendly analytics by Plausible -->
	<script async src="https://plausible.io/js/pa-fFM5ftluoRpqmNP0vIQHo.js"></script>
	<script>
		window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)},plausible.init=plausible.init||function(i){plausible.o=i||{}};
		plausible.init()
	</script>
</svelte:head>

<EffectsProvider />
<BrushCanvas />
<MirrorOverlay />
<ClearOverlay />
<RadioProvider />

<PageGrid>
	<Navbar />

	{@render children()}
</PageGrid>
