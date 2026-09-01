<script lang="ts">
  import { browser } from "$app/environment";

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
    ></video>
  {/if}
</div>

<style>
  .live-portal {
    aspect-ratio: 1/1;
    object-fit: cover;
  }
</style>
