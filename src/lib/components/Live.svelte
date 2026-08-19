<script lang="ts">
  let { live }: { live?: string } = $props();
</script>

<div class="live">
  <div class="component-title text-body"> Live </div>

  {#if live}
    <video autoplay muted loop class="live-portal" src={live}></video>
  {/if}
</div>

<style>
  .live-portal {
    aspect-ratio: 1/1;
    object-fit: cover;
  }
</style>
