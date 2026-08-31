<script lang="ts">
  import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
  import { previewState } from "$lib/state/preview.svelte";
  import { optimizedUrlFor } from "$lib/sanity/image";
  import favicon from "$lib/assets/favicon.png";

  const fileCabinet = "/images/file-cabinet.png";

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
        <div class="project-data-wrapper">
          <span class="index col-1">{i + 1}</span>
          <span class="year col-3">{project.year}</span>
          <span class="title col-4">
            <span class="title-default">{project.title}</span>
            <span class="title-hover"
              >{project.comingSoonText || "Coming Soon"}</span
            >
          </span>
        </div>

        <span class="categories">{project.categories?.join(", ")}</span>
        <span class="preview-thumb">
          {#if project.coverVideo}
            <video src={project.coverVideo} autoplay muted loop playsinline
            ></video>
          {:else if project.coverImage}
            <img
              src={optimizedUrlFor(project.coverImage, 400)}
              alt=""
              loading="lazy"
            />
          {:else if project.comingSoonText === "Archived"}
            <img class="favicon-placeholder" src={fileCabinet} alt="" />
          {:else}
            <img class="favicon-placeholder" src={favicon} alt="" />
          {/if}
        </span>
      </span>
    {:else}
      <a
        href="/projects/{project.slug.current}"
        class="project-item text-body col-4 col-tablet-2 col-mobile-5"
        class:active={project.slug.current === activeSlug}
        onmouseenter={() => (previewState.hoveredIndex = i)}
      >
        <div class="project-data-wrapper">
          <span class="index col-1">{i + 1}</span>
          <span class="year col-3">{project.year}</span>
          <span class="title col-4">{project.title}</span>

          <span class="categories">{project.categories?.join(", ")}</span>
        </div>

        {#if project.coverVideo || project.coverImage}
          <span class="preview-thumb">
            {#if project.coverVideo}
              <video src={project.coverVideo} autoplay muted loop playsinline
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
    padding-top: var(--spacing-sm);
  }
  .project-data-wrapper {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-sm) var(--spacing);
  }
  .project-item {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-sm);
    box-sizing: border-box;
    border-top: dotted 1px transparent;
    border-bottom: dotted 1px transparent;
    padding: var(--spacing-sm) 0;
  }

  .categories {
    text-transform: capitalize;
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
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    aspect-ratio: 4/3;
  }
  .preview-thumb img,
  .preview-thumb video {
    width: 100%;
    aspect-ratio: 4/3;
    object-fit: cover;
  }
  .preview-thumb .favicon-placeholder {
    width: 24px;
    height: 24px;
    object-fit: contain;
  }

  .project-item.active {
    border-bottom-style: dashed;
    border-top-style: dashed;
    border-bottom-color: black;
    border-top-color: black;
  }

  .project-item:hover {
    border-bottom-color: black;
    border-top-color: black;
  }
</style>
