<script lang="ts">
  import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
  import { previewState } from "$lib/state/preview.svelte";
  import { optimizedUrlFor } from "$lib/sanity/image";
  import { pauseOffscreen } from "$lib/actions/pauseOffscreen";
  import favicon from "$lib/assets/favicon.png";

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
    <span class="col-4 col-tablet-2 col-mobile-1">Year</span>
    <span class="col-4 col-tablet-3 col-mobile-2 type-col">Type</span>
    {#if showPreview}
      <span class="col-4 col-tablet-3 col-mobile-2">Preview</span>
    {/if}
  </div>

  <ul>
    {#each projects as project, i (project.slug.current)}
      {@const galleryItems = (project.gallery ?? []).slice(0, 5)}
      {#snippet gallery()}
        {#if galleryItems.length > 0}
          <div class="project-gallery">
            {#each galleryItems as item (item._key)}
              <div class="gallery-thumb col-4 col-tablet-2 col-mobile-1">
                {#if item._type === "galleryVideo" && item.url}
                  <video src={item.url} autoplay muted loop playsinline use:pauseOffscreen
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
        {:else if project.comingSoon && project.comingSoonText !== "Archived"}
          <div class="project-gallery">
            {#each { length: 5 } as _, slot (slot)}
              <div class="gallery-thumb col-4 col-tablet-2 col-mobile-1">
                <img class="favicon-placeholder" src={favicon} alt="" />
              </div>
            {/each}
          </div>
        {/if}
      {/snippet}
      <li>
        {#if project.comingSoon}
          <span
            class="text-body coming-soon"
            onmouseenter={() => (previewState.hoveredIndex = i)}
          >
            <span class="row-info">
              <span class="col-1 col-tablet-1 col-mobile-1">{i + 1}</span>
              <span class="project-title">
                <span class="title-default">{project.title}</span>
                <span class="title-hover"
                  >{project.comingSoonText || "Coming Soon"}</span
                >
              </span>
              <span class="col-4 col-tablet-2 col-mobile-1">{project.year}</span>
              <span class="col-4 col-tablet-3 col-mobile-2 type-col"
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
                      use:pauseOffscreen
                    ></video>
                  {:else if project.coverImage}
                    <img
                      src={optimizedUrlFor(project.coverImage, 200)}
                      alt=""
                      loading="lazy"
                    />
                  {:else if project.comingSoonText !== "Archived"}
                    <img class="favicon-placeholder" src={favicon} alt="" />
                  {/if}
                </span>
              {/if}
            </span>
            {@render gallery()}
          </span>
        {:else}
          <a
            href="/projects/{project.slug.current}"
            class="text-body"
            class:active={project.slug.current === activeSlug}
            onmouseenter={() => (previewState.hoveredIndex = i)}
          >
            <span class="row-info">
              <span class="col-1 col-tablet-1 col-mobile-1">{i + 1}</span>
              <span class="project-title">{project.title}</span>
              <span class="col-4 col-tablet-2 col-mobile-1">{project.year}</span>
              <span class="col-4 col-tablet-3 col-mobile-2 type-col"
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
                      use:pauseOffscreen
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
            {@render gallery()}
          </a>
        {/if}
      </li>
    {/each}
  </ul>
</div>

<style>
  .preview-thumb {
    aspect-ratio: 4/3;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .preview-thumb .favicon-placeholder {
    width: 24px;
    height: 24px;
    object-fit: contain;
    padding: 0;
  }

  .preview-thumb img,
  .preview-thumb video {
    width: 100%;
    height: 100%;
    object-fit: contain;
    padding: var(--spacing-sm) 0;
  }

  .header-bar,
  .row-info {
    display: flex;
    gap: var(--spacing);
  }

  li a,
  li .coming-soon {
    display: flex;
    flex-direction: column;
  }

  .header-bar {
    text-transform: uppercase;
  }
  li .type-col {
    text-transform: capitalize;
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
    margin-bottom: var(--spacing);
    border-top: dotted 1px transparent;
    border-bottom: dotted 1px transparent;
    box-sizing: border-box;
    padding: var(--spacing) 0 ;
  }
  li:last-child {
    margin-bottom: 0;
  }
  li:has(> a.active) {
    border-bottom-style: dashed;
    border-top-style: dashed;
    border-bottom-color: black;
    border-top-color: black;
  }

  li:has(> a:hover),
  li:has(> .coming-soon:hover) {
    border-bottom-color: black;
    border-top-color: black;
  }

  .project-gallery {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing);
    margin-top: var(--spacing-sm);
  }

  .gallery-thumb {
    aspect-ratio: 4/3;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .gallery-thumb .favicon-placeholder {
    width: 24px;
    height: 24px;
    object-fit: contain;
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
