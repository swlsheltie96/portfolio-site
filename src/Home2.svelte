<script>
  import { onMount } from "svelte";

  const minWidth = 200;

  let contentEl;
  let containerWidth = 0;
  let horizontalPadding = 0;

  let wordmarkEl;
  let wordmarkWidth = 0;
  let wordmarkPadding = 0;

  let offset = 0;
  let isDesktop = false;
  let shanRevealed = false;

  function toggleShan() {
    shanRevealed = !shanRevealed;
  }

  function clamp(val, min, max) {
    return Math.min(Math.max(val, min), max);
  }

  function paddingX(el) {
    const style = getComputedStyle(el);
    return parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
  }

  function updateMeasurements() {
    if (contentEl) horizontalPadding = paddingX(contentEl);
    if (wordmarkEl) wordmarkPadding = paddingX(wordmarkEl);
    isDesktop = window.innerWidth >= 740;
  }

  $: availableWidth = Math.max(containerWidth - horizontalPadding, 0);
  $: half = availableWidth / 2;
  $: textWidth = availableWidth
    ? clamp(half + offset, minWidth, availableWidth - minWidth)
    : 0;
  $: placeholderWidth = availableWidth ? availableWidth - textWidth : 0;
  $: textStyle =
    isDesktop && availableWidth ? `flex: 0 0 ${textWidth}px` : "";
  $: placeholderStyle =
    isDesktop && availableWidth ? `flex: 0 0 ${placeholderWidth}px` : "";

  $: wordmarkAvailableWidth = Math.max(wordmarkWidth - wordmarkPadding, 0);
  $: wordmarkHalf = wordmarkAvailableWidth / 2;
  $: shannonWidth = wordmarkAvailableWidth
    ? clamp(wordmarkHalf + offset, minWidth, wordmarkAvailableWidth - minWidth)
    : 0;
  $: studioWidth = wordmarkAvailableWidth
    ? wordmarkAvailableWidth - shannonWidth
    : 0;
  $: shannonStyle =
    isDesktop && wordmarkAvailableWidth ? `flex: 0 0 ${shannonWidth}px` : "";
  $: studioStyle =
    isDesktop && wordmarkAvailableWidth ? `flex: 0 0 ${studioWidth}px` : "";

  function handleWheel(e) {
    if (!isDesktop || !availableWidth) return;
    e.preventDefault();
    offset = clamp(
      offset + e.deltaY,
      minWidth - half,
      availableWidth - minWidth - half,
    );
  }

  onMount(() => {
    updateMeasurements();
    window.addEventListener("resize", updateMeasurements);
    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      window.removeEventListener("resize", updateMeasurements);
      window.removeEventListener("wheel", handleWheel);
    };
  });
</script>

<div class="main">
  <div class="wordmark" bind:this={wordmarkEl} bind:clientWidth={wordmarkWidth}>
    <div class="shannon" class:revealed={shanRevealed} style={shannonStyle}>
      <span class="shan-desktop">Shan</span>
      <span class="shan-mobile">Shannon Lin</span>
    </div>

    <div class="studio" style={studioStyle} on:click={toggleShan}>
      <span class="non">non</span>
      <span class="studio">Studio</span>
    </div>
  </div>

  <main class="content" bind:this={contentEl} bind:clientWidth={containerWidth}>
    <div class="text-column" style={textStyle}>
      <div class="text-main"
        ><p>
          a digital and physical design practice. Current and past collaborators
          include The New York Times, Netflix, The Atlantic, Base Design, Porto
          Rocha, The Office Arts, The Canada Pavilion at the Venice Biennial,
          Middlebrow Podcast, Feed Me...
        </p>
        <p>
          web design & development, art direction, branding, graphic design,
          interaction design, creative strategy and more.
        </p></div
      >

      <footer class="footer-desktop">
        <a href="mailto:shannon.w.lin424@gmail.com">Email</a>
        <a href="https://www.are.na/shannon-lin/channels">Are.na</a>
        <a href="https://www.instagram.com/swl_at_gmail_dot_com/">Instagram</a>
      </footer>
    </div>

    <video
      class="placeholder"
      style={placeholderStyle}
      src="/main-video.mp4"
      autoplay
      muted
      loop
      playsinline
    ></video>

    <footer class="footer-mobile">
      <a href="mailto:shannon.w.lin424@gmail.com">Email</a>
      <a href="#">Are.na</a>
      <a href="#">Instagram</a>
    </footer>
  </main>
</div>

<style>
  :global(*),
  :global(*::before),
  :global(*::after) {
    box-sizing: border-box;
  }

  :global(html),
  :global(body) {
    margin: 0;
    padding: 0;
    overflow-x: hidden;
  }

  :global(body) {
    font-family: Helvetica, Arial, sans-serif;
    color: black;
    background-color: white;
    /* padding: 20px; */
  }
  .main {
    display: flex;
    flex-direction: column;
    width: 100%;
    overflow-x: hidden;
    height: 100vh;
    height: 100dvh;
    padding: 10px;
  }

  a {
    color: black;
  }

  p {
    margin: 0;
  }

  /* wordmark */
  .wordmark {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0;
  }
  .shannon {
    display: none;
  }
  .shannon.revealed {
    display: block;
  }
  .shan-desktop {
    display: none;
  }
  .shan-mobile {
    display: inline;
  }
  .studio {
    cursor: pointer;
  }

  /* content */
  .content {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;
  }

  .text-column {
    grid-area: text;
    display: flex;
    flex-direction: column;
    flex: 0 0 auto;
    gap: 30px;
    margin-bottom: auto;
  }
  .text-main p {
    margin-bottom: 10px;
  }

  .placeholder {
    grid-area: placeholder;
    display: block;
    background-color: #dcdcdc;
    object-fit: cover;
    flex: 0 0 auto;
    width: 100%;
    aspect-ratio: 16 / 9;
  }
  /* footer */
  .footer-mobile {
    grid-area: footer;
    display: flex;
    justify-content: space-between;
    flex: 0 0 auto;
    margin-top: 30px;
  }
  .footer-desktop {
    display: none;
  }
  @media (min-width: 740px) {
    .main {
      flex-direction: column;
      height: 100vh;
      justify-content: space-between;
      padding: 0;
    }
    .wordmark {
      justify-content: flex-start;
      margin: 0;
      padding: 10px 10px 0 10px;
    }
    .shannon {
      display: block;
    }
    .shan-desktop {
      display: inline;
    }
    .shan-mobile {
      display: none;
    }
    .studio {
      display: flex;
      justify-content: space-between;
    }

    .content {
      display: flex;
      flex-direction: row;
      flex: 0 1 auto;
      min-height: auto;
      padding: 0px 10px 10px 10px;
    }
    .text-column {
      display: flex;
      flex-direction: column;
      flex: 0 1 auto;
      justify-content: space-between;
      margin-bottom: 0;
    }
    .placeholder {
      width: auto;
      aspect-ratio: auto;
      height: auto;
      min-height: 80vh;
    }

    .footer-mobile {
      margin-top: 0;
      display: none;
    }
    .footer-desktop {
      display: flex;
      justify-content: space-between;
      padding-right: 10px;
    }
  }
</style>
