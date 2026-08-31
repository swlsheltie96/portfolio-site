<script lang="ts">
  import { mirrorState } from "$lib/state/mirror.svelte";
</script>

{#if mirrorState.active}
  <div class="mirror-overlay">
    <img src="/images/macbook.png" alt="" />
  </div>
{/if}

<style>
  .mirror-overlay {
    position: fixed;
    inset: 0;
    width: 100vw;
    height: 100vh;
    z-index: 9;
    padding: 60px;
  }

  .mirror-overlay img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
</style>
