<script lang="ts">
  import { onMount } from "svelte";
  import { urlFor } from "$lib/sanity/image";
  import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
  import { previewState } from "$lib/state/preview.svelte";

  let {
    projects,
  }: {
    projects: {
      title: string;
      coverImage?: SanityImageSource;
      coverVideo?: string;
    }[];
  } = $props();

  let carouselIndex = $state(0);
  let isMobile = $state(false);

  onMount(() => {
    // Matches the site-wide mobile breakpoint (see stickyAtStart.ts).
    isMobile = window.matchMedia("(max-width: 749px)").matches;

    for (const project of projects) {
      if (project.coverVideo || !project.coverImage) continue;
      const img = new Image();
      img.src = urlFor(project.coverImage).width(800).url();
    }

    if (isMobile) {
      const interval = setInterval(() => {
        carouselIndex = (carouselIndex + 1) % projects.length;
      }, 3000);

      return () => clearInterval(interval);
    }
  });

  let displayIndex = $derived(
    isMobile ? carouselIndex : previewState.hoveredIndex,
  );
  let displayProject = $derived(projects[displayIndex]);
</script>

<div class="preview">
  <div class="component-title text-body"> Preview </div>
  {#if displayProject?.coverVideo}
    <video src={displayProject.coverVideo} autoplay muted loop playsinline></video>
  {:else if displayProject?.coverImage}
    <img
      src={urlFor(displayProject.coverImage).width(800).url()}
      alt={displayProject.title}
      loading="lazy"
    />
  {/if}
</div>

<style>
  .preview {
    aspect-ratio: 4 / 3;
  }

  .preview img,
  .preview video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
</style>
