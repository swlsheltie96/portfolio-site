<script lang="ts">
	import { optimizedUrlFor, srcSetFor } from '$lib/sanity/image';
	import ProjectsListSmall from '$lib/components/ProjectsListSmall.svelte';
	import Info from '$lib/components/Info.svelte';
	let { data } = $props();
	let project = $derived(data.project);
</script>

<div class="project-data col-4 col-tablet-4 col-mobile-5 component">
	<div class="number-date text-body">
		<div class="col-2 col-tablet-2 col-mobile-2">{data.index}</div>
		<div class="col-2 col-tablet-2 col-mobile-2">{project.year}</div>
	</div>

	<div class="title text-body">
		{project.title}
	</div>

	<div class="type text-body">
		{project.categories?.join(', ')}
	</div>

	{#if project.excerpt}
		<div class="project-excerpt col-4 col-tablet-4 col-mobile-5">
			<p class="text-body">{project.excerpt}</p>
		</div>
	{/if}
</div>
<div class="project-media col-16 col-tablet-10 col-mobile-5">
	{#if project.gallery?.length}
		<div class="gallery" class:stacked={project.stackGallery}>
			{#each project.gallery as item (item._key)}
				{@const desktopCol = item.width === 'quarter' ? 4 : item.width === 'half' ? 8 : 16}
				{@const tabletCol = item.width === 'quarter' ? 3 : item.width === 'half' ? 5 : 10}
				{@const colClass = `col-${desktopCol} col-tablet-${tabletCol} col-mobile-5`}
				{@const imageWidth = item.width === 'quarter' ? 600 : item.width === 'half' ? 1200 : 1600}
				{@const sizes =
					item.width === 'quarter'
						? '(max-width: 767px) 100vw, (max-width: 1023px) 22.5vw, 20vw'
						: item.width === 'half'
							? '(max-width: 767px) 100vw, (max-width: 1023px) 45vw, 40vw'
							: '(max-width: 767px) 100vw, (max-width: 1023px) 90vw, 80vw'}
				<div class="media-container {colClass}">
					{#if item._type === 'galleryImage' && item.asset}
						<img
							src={optimizedUrlFor(item, imageWidth)}
							srcset={srcSetFor(item)}
							{sizes}
							alt={item.alt ?? ''}
							loading="lazy"
						/>
					{:else if item._type === 'galleryImageUrl' && item.url}
						<img src={item.url} alt={item.alt ?? ''} loading="lazy" />
					{:else if item._type === 'galleryVideo' && item.url}
						<video src={item.url} autoplay muted loop>
							{#if item.caption}
								<track kind="captions" label={item.caption} />
							{/if}
						</video>
					{/if}
					{#if item.link && item.showLinkButton !== false}
						<div class="media-link">
							<a
								class="button"
								href={item.link}
								target="_blank"
								rel="noopener noreferrer"
								><span class="link-text">See Live</span>
								↗</a
							>
						</div>
					{/if}
					<div class="item-info">
						{#if item.caption}
							<div class="item-caption col-8 col-tablet-8 col-mobile-5">
								{#if item.link}
									<p class="caption text-small">
										<a
											href={item.link}
											target="_blank"
											rel="noopener noreferrer"
											><span class="link-text text-small"
												>{item.linkText || 'See Project'}</span
											>
											↗</a
										>
										<br /> <br />
									</p>
								{/if}
								<p class="caption text-small">{item.caption}</p>
							</div>
						{/if}
					</div>
				</div>
			{/each}
			<div class="all-projects related component col-16 col-tablet-10 col-mobile-5">
				<ProjectsListSmall
					projects={data.projects}
					activeSlug={project.slug.current}
				/>
			</div>
		</div>
	{/if}
</div>
<div class="footer component col-20 col-tablet-10 col-mobile-5">
	<Info
		email={data.siteSettings.email}
		phone={data.siteSettings.phone}
		address={data.siteSettings.address}
		instagramLink={data.siteSettings.instagramLink}
		arenaLink={data.siteSettings.arenaLink}
		linkedinLink={data.siteSettings.linkedinLink}
	/>
</div>

<style>
	.number-date {
		display: flex;
		gap: var(--spacing);
	}
	.project-wrapper {
		position: relative;
		height: fit-content;
	}
	.project-data {
		position: sticky;
		top: calc(var(--navbar-height, 0px) + var(--spacing) * 2);
		height: calc(100vh - calc(var(--navbar-height, 0px) + var(--spacing) * 3));
		z-index: -1;
		gap: var(--spacing);
		display: inline-flex;
		flex-direction: column;
		margin: 0;
		padding-top: var(--spacing);
	}
	@media (max-width: 749px) {
		.project-data {
			position: static;
			height: auto;
		}
	}
	.project-excerpt {
		border-top: 1px solid black;
		padding-top: var(--spacing);
	}
	.project-media {
		padding-bottom: var(--spacing);
		/* margin-top: -100vh; */
		margin-top: calc(var(--spacing));
	}
	.media-link a.button {
		background-color: white;
		border: solid 1px #ededed;
		border-radius: 2px;
	}
	.link-text {
		text-decoration: underline;
	}
	.media-container {
		position: relative;
	}
	.caption {
		white-space: pre-line;
	}
	.media-link {
		position: absolute;
		left: 10px;
		top: 10px;
	}
	.item-info {
		display: flex;
		gap: var(--spacing);
		margin-top: var(--spacing);
		flex-direction: column;
		align-items: flex-end;
	}
	.item-info a.button {
		/* width: 100%; */
	}
	.item-caption {
		background-color: #ededed;
		padding: var(--spacing);
		border-radius: 2px;
		/* border: solid 1px #ededed; */
	}
	.gallery {
		display: flex;
		flex-wrap: wrap;
		gap: var(--spacing);
		justify-content: flex-end;
	}
	.gallery.stacked {
		flex-direction: column;
		align-items: flex-end;
	}
	.gallery .media-container {
		/* box-shadow: -2px 2px 5px 3px #dddddd; */
		border-radius: 2px;
		overflow: hidden;
	}
	.gallery img,
	.gallery video {
		width: 100%;
	}
	.all-projects.related {
		/* height: calc(100vh - var(--navbar-height) - var(--spacing) * 4); */
		min-height: calc(
			100vh - calc(var(--navbar-height) + var(--spacing) * 6) - 42px
		);
	}
</style>
