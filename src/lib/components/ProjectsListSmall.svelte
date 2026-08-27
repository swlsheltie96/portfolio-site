<script lang="ts">
  import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
  import { previewState } from "$lib/state/preview.svelte";
  import { optimizedUrlFor } from "$lib/sanity/image";

  type GalleryItem = {
    _key: string;
    _type: string;
    asset?: unknown;
    url?: string;
    alt?: string;
  };

  let {
    projects,
    activeSlug,
    showPreview = 0,
  }: {
    projects: {
      title: string;
      slug: { current: string };
      year: number;
      categories?: string[];
      coverImage?: SanityImageSource;
      coverVideo?: string;
      comingSoon?: boolean;
      comingSoonText?: string;
      gallery?: GalleryItem[];
    }[];
    activeSlug?: string;
    showPreview?: number;
  } = $props();
</script>

<div class="projects-list-wrapper">
  <div class="component-title text-body">Projects</div>

  <div class="header-bar text-body">
    <span class="col-1 col-tablet-1 col-mobile-1">No.</span>
    <span class="project-title">Title</span>
    <span class="col-2 col-tablet-2 col-mobile-1">Year</span>
    <span class="col-3 col-tablet-3 col-mobile-2 type-col">Type</span>
    {#if showPreview}
      <span class={`col-${2 * showPreview} col-tablet-${showPreview} col-mobile-${showPreview}`}>Preview</span>
    {/if}
  </div>

  <ul>
    {#each projects as project, i (project.slug.current)}
      <li>
        {#if project.comingSoon}
          <span
            class="text-body coming-soon"
            onmouseenter={() => (previewState.hoveredIndex = i)}
          >
            <span class="col-1 col-tablet-1 col-mobile-1">{i + 1}</span>
            <span class="project-title">
              <span class="title-default">{project.title}</span>
              <span class="title-hover"
                >{project.comingSoonText || "Coming Soon"}</span
              >
            </span>
            <span class="col-2 col-tablet-2 col-mobile-1">{project.year}</span>
            <span class="col-3 col-tablet-3 col-mobile-2 type-col"
              >{project.categories?.join(", ")}</span
            >
            {#each { length: showPreview } as _, slot (slot)}
              {@const item = project.gallery?.[slot]}
              <span class="preview-thumb col-2 col-tablet-1 col-mobile-1">
                {#if item?._type === "galleryVideo" && item.url}
                  <video src={item.url} autoplay muted loop playsinline
                  ></video>
                {:else if item?._type === "galleryImageUrl" && item.url}
                  <img src={item.url} alt={item.alt ?? ""} loading="lazy" />
                {:else if item?._type === "galleryImage" && item.asset}
                  <img
                    src={optimizedUrlFor(item as SanityImageSource, 200)}
                    alt={item.alt ?? ""}
                    loading="lazy"
                  />
                {/if}
              </span>
            {/each}
          </span>
        {:else}
          <a
            href="/projects/{project.slug.current}"
            class="text-body"
            class:active={project.slug.current === activeSlug}
            onmouseenter={() => (previewState.hoveredIndex = i)}
          >
            <span class="col-1 col-tablet-1 col-mobile-1">{i + 1}</span>
            <span class="project-title">{project.title}</span>
            <span class="col-2 col-tablet-2 col-mobile-1">{project.year}</span>
            <span class="col-3 col-tablet-3 col-mobile-2 type-col"
              >{project.categories?.join(", ")}</span
            >
            {#each { length: showPreview } as _, slot (slot)}
              {@const item = project.gallery?.[slot]}
              <span class="preview-thumb col-2 col-tablet-1 col-mobile-1">
                {#if item?._type === "galleryVideo" && item.url}
                  <video src={item.url} autoplay muted loop playsinline
                  ></video>
                {:else if item?._type === "galleryImageUrl" && item.url}
                  <img src={item.url} alt={item.alt ?? ""} loading="lazy" />
                {:else if item?._type === "galleryImage" && item.asset}
                  <img
                    src={optimizedUrlFor(item as SanityImageSource, 200)}
                    alt={item.alt ?? ""}
                    loading="lazy"
                  />
                {/if}
              </span>
            {/each}
          </a>
        {/if}
      </li>
    {/each}
  </ul>
</div>

<style>
  .preview-thumb {
    aspect-ratio: 4/3;
  }

  .preview-thumb img,
  .preview-thumb video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    padding: var(--spacing-sm) 0;
  }

  .header-bar,
  li a,
  li .coming-soon {
    display: flex;
    gap: var(--spacing);
  }

  .header-bar {
    text-transform: uppercase;
  }
  .project-title {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .title-hover {
    display: none;
  }
  li .coming-soon:hover .title-default {
    display: none;
  }
  li .coming-soon:hover .title-hover {
    display: inline;
  }
  li .coming-soon:hover {
    color: #999;
  }
  li {
    margin-bottom: calc(var(--spacing) / 2);
  }
  li:last-child {
    margin-bottom: 0;
  }
  li a.active {
    /* font-weight: bold; */
    border-bottom: dashed 1px black;
    border-top: dashed 1px black;
    /* padding-bottom: var(--spacing); */
    /* margin-bottom: var(--spacing);
		margin-top: var(--spacing); */
    box-sizing: border-box;
  }

  li a:hover,
  li .coming-soon:hover {
    border-bottom: dotted 1px black;
    border-top: dotted 1px black;
    /* margin-bottom: var(--spacing); */
    /* margin-bottom: var(--spacing);
		margin-top: var(--spacing); */
    box-sizing: border-box;
  }

  @media (max-width: 749px) {
    .type-col {
      display: none;
    }
  }
</style>
