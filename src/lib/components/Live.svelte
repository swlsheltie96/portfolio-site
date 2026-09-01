<script lang="ts">
  import { browser } from "$app/environment";
  import { pauseOffscreen } from "$lib/actions/pauseOffscreen";

  let { liveVideoUrls = [] }: { liveVideoUrls?: string[] } = $props();

  let selectedVideo = $derived(
    browser
      ? liveVideoUrls[Math.floor(Math.random() * liveVideoUrls.length)]
      : liveVideoUrls[0],
  );
</script>

<div class="live">
  <div class="component-title text-body"> Live </div>

  {#if selectedVideo}
    <video
      autoplay
      muted
      loop
      playsinline
      class="live-portal"
      src={selectedVideo}
      use:pauseOffscreen
    ></video>
  {/if}
</div>

<style>
  .live-portal {
    aspect-ratio: 1/1;
    object-fit: cover;
  }
</style>
