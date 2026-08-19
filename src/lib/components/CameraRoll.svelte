<script lang="ts">
	import { optimizedUrlFor } from '$lib/sanity/image';
	import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

	let {
		images = [],
	}: {
		images?: (SanityImageSource & {
			_key: string;
			_type: string;
			alt?: string;
			asset?: unknown;
			url?: string;
			projectSlug?: string;
		})[];
	} = $props();

	let validImages = $derived(
		images.filter((image) => image?.asset || image?.url),
	);
</script>

<div class="camera-roll-wrapper">
	<div class="component-title text-body">Camera Roll</div>
	{#if validImages.length > 0}
		<div class="camera-roll">
			{#each validImages as image (image._key)}
				{@const href = image.projectSlug
					? `/projects/${image.projectSlug}`
					: undefined}
				{@const imgSrc =
					image._type === 'galleryImageUrl'
						? image.url
						: optimizedUrlFor(image, 300)}
				<div class="camera-roll-item col-1 col-tablet-4 col-mobile-1">
					{#if href}
						<a {href}>
							<img src={imgSrc} alt={image.alt ?? ''} loading="lazy" />
						</a>
					{:else}
						<img src={imgSrc} alt={image.alt ?? ''} loading="lazy" />
					{/if}
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	.camera-roll {
		display: flex;
		flex-wrap: wrap;
		gap: var(--spacing);
	}

	.camera-roll-item {
		position: relative;
		aspect-ratio: 1/1;
	}

	.camera-roll-item a {
		display: contents;
	}

	.camera-roll-item img {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: inset 0.2s ease;
	}

	.camera-roll-item:hover img {
		transform: scale(1.1);
		z-index: 1;
	}
</style>
