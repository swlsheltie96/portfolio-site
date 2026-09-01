<script lang="ts">
  import { onMount } from "svelte";
  import { urlFor } from "$lib/sanity/image";
  import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
  import { previewState } from "$lib/state/preview.svelte";
  import { pauseOffscreen } from "$lib/actions/pauseOffscreen";
  import favicon from "$lib/assets/favicon.png";

  const fileCabinet = "/images/file-cabinet.png";

  let {
    projects,
  }: {
    projects: {
      title: string;
      coverImage?: SanityImageSource;
      coverVideo?: string;
      comingSoon?: boolean;
      comingSoonText?: string;
    }[];
  } = $props();

  let carouselIndex = $state(0);
  let isMobile = $state(false);

  // Projects with no cover image/video would render blank in the carousel —
  // skip them rather than cycling to an empty frame.
  let mediaProjects = $derived(
    projects.filter((project) => project.coverVideo || project.coverImage),
  );

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
        if (mediaProjects.length === 0) return;
        carouselIndex = (carouselIndex + 1) % mediaProjects.length;
      }, 3000);

      return () => clearInterval(interval);
    }
  });

  let displayProject = $derived(
    isMobile ? mediaProjects[carouselIndex] : projects[previewState.hoveredIndex],
  );
</script>

<div class="preview">
  <div class="component-title text-body"> Preview </div>
  <div class="preview-media">
    {#if displayProject?.coverVideo}
      <video
        src={displayProject.coverVideo}
        autoplay
        muted
        loop
        playsinline
        use:pauseOffscreen
      ></video>
    {:else if displayProject?.coverImage}
      <img
        src={urlFor(displayProject.coverImage).width(800).url()}
        alt={displayProject.title}
        loading="lazy"
      />
    {:else if displayProject?.comingSoon && displayProject.comingSoonText === "Archived"}
      <img class="favicon-placeholder" src={fileCabinet} alt="" />
    {:else if displayProject?.comingSoon}
      <img class="favicon-placeholder" src={favicon} alt="" />
    {/if}
  </div>
</div>

<style>
  .preview {
    aspect-ratio: 4 / 3;
  }

  .preview-media {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .preview-media img,
  .preview-media video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .preview-media .favicon-placeholder {
    width: 24px;
    height: 24px;
    object-fit: contain;
  }
</style>
