<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import About from '$lib/components/About.svelte';
	import Info from '$lib/components/Info.svelte';
	import Clients from '$lib/components/Clients.svelte';
	import ProjectsListSmall from '$lib/components/ProjectsListSmall.svelte';
	import ProjectsListMedium from '$lib/components/ProjectsListMedium.svelte';
	import ProjectsListLarge from '$lib/components/ProjectsListLarge.svelte';
	import Preview from '$lib/components/Preview.svelte';
	import News from '$lib/components/News.svelte';
	import CameraRoll from '$lib/components/CameraRoll.svelte';
	import Live from '$lib/components/Live.svelte';
	import Radio from '$lib/components/Radio.svelte';
	import Recognition from '$lib/components/Recognition.svelte';
	import SpeechBubble from '$lib/components/SpeechBubble.svelte';
	import { layouts, mobileLayout, type ComponentName, type LayoutSlot } from '$lib/layouts';
	import { layoutState } from '$lib/state/layout.svelte';
	import { viewportState } from '$lib/state/viewport.svelte';
	import { stickyAtStart } from '$lib/components/effects/actions/stickyAtStart';

	let { data } = $props();

	const componentMap: Partial<Record<ComponentName, any>> = {
		Header,
		About,
		Info,
		Clients,
		ProjectsListSmall,
		ProjectsListMedium,
		ProjectsListLarge,
		Preview,
		News,
		CameraRoll,
		Live,
		Radio,
		Recognition,
		SpeechBubble,
	};

	let propsMap = $derived<
		Partial<Record<ComponentName, Record<string, unknown>>>
	>({
		Header: { text: data.siteSettings.headerText },
		About: { text: data.siteSettings.about },
		Info: {
			email: data.siteSettings.email,
			phone: data.siteSettings.phone,
			address: data.siteSettings.address,
			instagramLink: data.siteSettings.instagramLink,
			arenaLink: data.siteSettings.arenaLink,
			linkedinLink: data.siteSettings.linkedinLink,
		},
		Clients: { items: data.siteSettings.clientsAndCollaborators },
		ProjectsListSmall: { projects: data.projects },
		ProjectsListMedium: { projects: data.projects },
		ProjectsListLarge: { projects: data.projects },
		Preview: { projects: data.projects },
		News: { news: data.news },
		CameraRoll: { images: data.galleryImages },
		Live: { liveVideoUrls: data.liveVideoUrls },
		Radio: {},
		Recognition: { recognition: data.recognition },
		SpeechBubble: {},
	});
</script>

{#snippet renderSlot(slot: LayoutSlot)}
	{@const colClass = `col-${slot.colSpan.desktop} col-tablet-${slot.colSpan.tablet} col-mobile-${slot.colSpan.mobile}`}
	{@const orderStyle = slot.order
		? Object.entries(slot.order)
				.map(([bp, v]) => `--order-${bp}:${v};`)
				.join('')
		: undefined}
	{#if slot.component === 'Spacer'}
		<div class="spacer {colClass}" style={orderStyle}></div>
	{:else if slot.component === 'Group'}
		<div
			class="group {colClass}"
			class:group-column={slot.direction === 'column'}
			style={orderStyle}
			use:stickyAtStart={slot.sticky}
		>
			{#each slot.children ?? [] as child}
				{@render renderSlot(child)}
			{/each}
		</div>
	{:else}
		{@const Component = componentMap[slot.component]}
		<div class="component {colClass}" style={orderStyle} use:stickyAtStart={slot.sticky}>
			<Component {...propsMap[slot.component]} showPreview={slot.showPreview} />
		</div>
	{/if}
{/snippet}

{#each viewportState.isMobile ? mobileLayout : layouts[layoutState.index] as slot}
	{@render renderSlot(slot)}
{/each}

<style>
	.group {
		display: flex;
		flex-wrap: wrap;
		align-items: flex-start;
		gap: 0 var(--spacing);
	}

	.group.group-column {
		flex-direction: column;
		flex-wrap: nowrap;
		gap: var(--spacing) 0;
	}
</style>
