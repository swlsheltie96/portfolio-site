<script lang="ts">
  import { clearState } from "$lib/state/clear.svelte";

  const FC_IMAGE_COUNT = 7;
  const MAPLE_GIFS = ["collage-1-grey-2.gif"];
  // collage-1-grey-2.gif loops in ~2010ms; the display window below is
  // timed to let it finish one full loop before fading out.
  const GIF_DISPLAY_MS = 2000;
  const GIF_FADE_MS = 200;

  let visible = $state(false);
  let gifFading = $state(false);
  let gifSrc = $state("");
  let fcMounted = $state(false);
  let fcOpaque = $state(false);
  let fcSrc = $state("");

  let fadeTimeout: ReturnType<typeof setTimeout> | undefined;
  let clearedTimeout: ReturnType<typeof setTimeout> | undefined;
  let fcHideTimeout: ReturnType<typeof setTimeout> | undefined;

  function showFc() {
    fcSrc = `/images/fc/fc-${Math.floor(Math.random() * FC_IMAGE_COUNT) + 1}.png`;
    fcMounted = true;
    // Flips to opaque on the next frame, so the browser has already
    // painted the opacity:0 starting state and the transition actually
    // plays instead of the two style changes getting batched together.
    requestAnimationFrame(() => {
      fcOpaque = true;
    });
  }

  function hideFc() {
    clearTimeout(fcHideTimeout);
    if (!fcMounted) return;
    fcOpaque = false;
    fcHideTimeout = setTimeout(() => {
      fcMounted = false;
    }, 200);
  }

  // Clicking Clear starts a fixed, automatic sequence: the gif appears
  // instantly while the page components fade out (that part lives in
  // PageGrid's CSS), and once the gif has had time to play through a full
  // loop (GIF_DISPLAY_MS) it starts its own fade (GIF_FADE_MS). Once the
  // page is fully clear, a random image from /fc fades in (200ms) centered
  // in that empty space. A click or scroll anywhere resets immediately
  // (components fade back in, gif/fc image fade out, cancelling any
  // in-progress auto-fade).
  $effect(() => {
    clearTimeout(fadeTimeout);
    clearTimeout(clearedTimeout);

    if (!clearState.active) {
      visible = false;
      gifFading = false;
      hideFc();
      return;
    }

    visible = true;
    gifFading = false;
    gifSrc = `/images/maplegifs/${MAPLE_GIFS[Math.floor(Math.random() * MAPLE_GIFS.length)]}`;
    fcMounted = false;
    fcOpaque = false;

    fadeTimeout = setTimeout(() => {
      gifFading = true;
    }, GIF_DISPLAY_MS);

    clearedTimeout = setTimeout(() => {
      visible = false;
      showFc();
    }, GIF_DISPLAY_MS + GIF_FADE_MS);

    return () => {
      clearTimeout(fadeTimeout);
      clearTimeout(clearedTimeout);
    };
  });

  $effect(() => {
    if (!clearState.active) return;

    const reset = () => {
      clearState.active = false;
    };

    document.addEventListener("click", reset);
    window.addEventListener("scroll", reset, { passive: true });

    return () => {
      document.removeEventListener("click", reset);
      window.removeEventListener("scroll", reset);
    };
  });
</script>

{#if visible}
  <div class="clear-overlay" class:fading={gifFading}>
    <img src={gifSrc} alt="" />
  </div>
{/if}

{#if fcMounted}
  <div class="fc-overlay" class:opaque={fcOpaque}>
    <img class="col-3 col-tablet-3 col-mobile-3" src={fcSrc} alt="" />
  </div>
{/if}

<style>
  .clear-overlay {
    position: fixed;
    inset: 0;
    width: 100vw;
    height: 100vh;
    z-index: 9;
    opacity: 1;
    transition: opacity 200ms;
  }

  .clear-overlay.fading {
    opacity: 0;
  }

  .clear-overlay img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    object-position: 50% 90%;
  }

  .fc-overlay {
    position: fixed;
    inset: 0;
    width: 100vw;
    height: 100vh;
    z-index: 9;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 200ms;
  }

  .fc-overlay.opaque {
    opacity: 1;
  }

  .fc-overlay img {
    height: auto;
  }
</style>
