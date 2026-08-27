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
      <span class="col-4 col-tablet-3 col-mobile-2">Preview</span>
    {/if}
  </div>

  <ul>
    {#each projects as project, i (project.slug.current)}
      {@const galleryItems = (project.gallery ?? []).slice(0, 5)}
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
            {#if showPreview}
              <span class="preview-thumb col-4 col-tablet-3 col-mobile-2">
                {#if project.coverVideo}
                  <video
                    src={project.coverVideo}
                    autoplay
                    muted
                    loop
                    playsinline
                  ></video>
                {:else if project.coverImage}
                  <img
                    src={optimizedUrlFor(project.coverImage, 200)}
                    alt=""
                    loading="lazy"
                  />
                {/if}
              </span>
            {/if}
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
            {#if showPreview}
              <span class="preview-thumb col-4 col-tablet-3 col-mobile-2">
                {#if project.coverVideo}
                  <video
                    src={project.coverVideo}
                    autoplay
                    muted
                    loop
                    playsinline
                  ></video>
                {:else if project.coverImage}
                  <img
                    src={optimizedUrlFor(project.coverImage, 200)}
                    alt=""
                    loading="lazy"
                  />
                {/if}
              </span>
            {/if}
          </a>
        {/if}

        {#if galleryItems.length > 0}
          <div class="project-gallery">
            {#each galleryItems as item (item._key)}
              <div class="gallery-thumb col-4 col-tablet-2 col-mobile-1">
                {#if item._type === "galleryVideo" && item.url}
                  <video src={item.url} autoplay muted loop playsinline
                  ></video>
                {:else if item._type === "galleryImageUrl" && item.url}
                  <img src={item.url} alt={item.alt ?? ""} loading="lazy" />
                {:else if item._type === "galleryImage" && item.asset}
                  <img
                    src={optimizedUrlFor(item as SanityImageSource, 300)}
                    alt={item.alt ?? ""}
                    loading="lazy"
                  />
                {/if}
              </div>
            {/each}
          </div>
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
    object-fit: contain;
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
    border-bottom: dashed 1px black;
    border-top: dashed 1px black;
    box-sizing: border-box;
  }

  li a:hover,
  li .coming-soon:hover {
    border-bottom: dotted 1px black;
    border-top: dotted 1px black;
    box-sizing: border-box;
  }

  .project-gallery {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing);
    margin-top: var(--spacing-sm);
  }

  .gallery-thumb {
    aspect-ratio: 4/3;
  }

  .gallery-thumb img,
  .gallery-thumb video {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  @media (max-width: 749px) {
    .type-col {
      display: none;
    }
  }
</style>
