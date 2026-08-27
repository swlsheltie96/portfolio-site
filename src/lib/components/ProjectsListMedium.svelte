<script lang="ts">
  import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
  import { previewState } from "$lib/state/preview.svelte";
  import { optimizedUrlFor } from "$lib/sanity/image";

  let {
    projects,
    activeSlug,
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
    }[];
    activeSlug?: string;
  } = $props();
</script>

<div class="projects-list-medium">
  {#each projects as project, i (project.slug.current)}
    {#if project.comingSoon}
      <span
        class="project-item text-body coming-soon col-4 col-tablet-2 col-mobile-5"
        onmouseenter={() => (previewState.hoveredIndex = i)}
      >
        <span class="index">{i + 1}</span>
        <span class="title">
          <span class="title-default">{project.title}</span>
          <span class="title-hover"
            >{project.comingSoonText || "Coming Soon"}</span
          >
        </span>
        <span class="year">{project.year}</span>
        <span class="categories">{project.categories?.join(", ")}</span>
        {#if project.coverVideo || project.coverImage}
          <span class="preview-thumb">
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
                src={optimizedUrlFor(project.coverImage, 400)}
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
        class="project-item text-body col-4 col-tablet-2 col-mobile-5"
        class:active={project.slug.current === activeSlug}
        onmouseenter={() => (previewState.hoveredIndex = i)}
      >
        <span class="index">{i + 1}</span>
        <span class="title">{project.title}</span>
        <span class="year">{project.year}</span>
        <span class="categories">{project.categories?.join(", ")}</span>
        {#if project.coverVideo || project.coverImage}
          <span class="preview-thumb">
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
                src={optimizedUrlFor(project.coverImage, 400)}
                alt=""
                loading="lazy"
              />
            {/if}
          </span>
        {/if}
      </a>
    {/if}
  {/each}
</div>

<style>
  .projects-list-medium {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing);
    align-items: flex-start;
  }

  .project-item {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-sm);
    box-sizing: border-box;
  }

  .title-hover {
    display: none;
  }
  .coming-soon:hover .title-default {
    display: none;
  }
  .coming-soon:hover .title-hover {
    display: inline;
  }
  .coming-soon:hover {
    color: #999;
  }

  .preview-thumb {
    width: 100%;
    aspect-ratio: 4/3;
  }
  .preview-thumb img,
  .preview-thumb video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .project-item.active {
    border-bottom: dashed 1px black;
    border-top: dashed 1px black;
  }

  .project-item:hover {
    border-bottom: dotted 1px black;
    border-top: dotted 1px black;
  }
</style>
