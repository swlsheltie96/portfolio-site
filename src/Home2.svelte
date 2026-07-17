<script>
  import { onMount, tick } from "svelte";
  import { crossfade } from "svelte/transition";

  const [send, receive] = crossfade({ duration: 400 });

  const minWidth = 200;

  let contentEl;
  let containerWidth = 0;
  let horizontalPadding = 0;

  let wordmarkEl;
  let wordmarkWidth = 0;
  let wordmarkPadding = 0;

  let offset = 0;
  let isDesktop = false;

  let shanDesktopEl;
  let nCharWidth = 0;
  let measureCanvas;

  let nonEl;
  let nonBaseWidth = 0;
  let studioSuffixWidth = 0;
  let mobileNCharWidth = 0;
  let mobileNCount = 0;
  let mobileFilled = false;
  let mobileFillInterval;

  let typedCount = 0;
  let introPlaying = true;
  let introInterval;
  let nsVisible = true;
  let rightOverpull = 0;
  const overpullThreshold = 150;

  let tapZoneDesktopEl;
  let tapZoneMobileEl;
  let clickStep = 0;
  let emailPos = { x: 0, y: 0 };
  let arenaPos = { x: 0, y: 0 };
  let instagramPos = { x: 0, y: 0 };

  function registerClick(zoneEl, e) {
    if (!zoneEl) return;
    const rect = zoneEl.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const nextStep = clickStep >= 3 ? 0 : clickStep + 1;
    if (nextStep === 1) instagramPos = { x, y };
    else if (nextStep === 2) emailPos = { x, y };
    else if (nextStep === 3) arenaPos = { x, y };
    clickStep = nextStep;
  }

  function handleDesktopTapZoneClick(e) {
    registerClick(tapZoneDesktopEl, e);
  }

  function handleMobileTapZoneClick(e) {
    registerClick(tapZoneMobileEl, e);
  }

  function resetTapZone() {
    clickStep = 0;
  }

  function animateMobileFill(target) {
    if (mobileFillInterval) clearInterval(mobileFillInterval);
    const start = mobileNCount;
    if (start === target) return;
    const step = target > start ? 1 : -1;
    let current = start;
    mobileFillInterval = setInterval(() => {
      current += step;
      mobileNCount = current;
      if (current === target) {
        clearInterval(mobileFillInterval);
      }
    }, 45);
  }

  function toggleMobileFill() {
    if (isDesktop) return;
    mobileFilled = !mobileFilled;
    animateMobileFill(mobileFilled ? mobileFillTarget : 0);
  }

  function playIntro(target) {
    if (introInterval) clearInterval(introInterval);
    typedCount = 0;
    introPlaying = true;
    if (target <= 0) {
      introPlaying = false;
      return;
    }
    let i = 0;
    introInterval = setInterval(() => {
      i++;
      typedCount = i;
      if (i >= target) {
        clearInterval(introInterval);
        introPlaying = false;
      }
    }, 45);
  }

  function measureTextWidth(text, font) {
    if (!measureCanvas) measureCanvas = document.createElement("canvas");
    const ctx = measureCanvas.getContext("2d");
    ctx.font = font;
    return ctx.measureText(text).width;
  }

  function updateFontMeasurements() {
    if (!shanDesktopEl) return;
    const style = getComputedStyle(shanDesktopEl);
    const font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
    nCharWidth = measureTextWidth("n", font);
  }

  function updateMobileFontMeasurements() {
    if (!nonEl) return;
    const style = getComputedStyle(nonEl);
    const font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
    nonBaseWidth = measureTextWidth("non", font);
    studioSuffixWidth = measureTextWidth(" Studio", font);
    mobileNCharWidth = measureTextWidth("n", font);
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
    updateFontMeasurements();
    updateMobileFontMeasurements();
  }

  $: availableWidth = Math.max(containerWidth - horizontalPadding, 0);
  $: half = availableWidth / 2;
  $: textWidth = availableWidth
    ? clamp(half + offset, minWidth, availableWidth - minWidth)
    : 0;
  $: placeholderWidth = availableWidth ? availableWidth - textWidth : 0;
  $: textStyle = isDesktop && availableWidth ? `flex: 0 0 ${textWidth}px` : "";
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

  $: if (wordmarkAvailableWidth && shannonWidth <= minWidth) {
    rightOverpull = 0;
    if (!nsVisible) {
      nsVisible = true;
      const target =
        isDesktop && nCharWidth
          ? Math.max(0, Math.floor(shannonWidth / nCharWidth))
          : 0;
      playIntro(target);
    }
  }

  $: fillCount =
    isDesktop && nCharWidth && nsVisible
      ? Math.max(0, Math.floor(shannonWidth / nCharWidth))
      : 0;
  $: shanDesktopText = "n".repeat(introPlaying ? typedCount : fillCount);

  $: mobileFillTarget =
    !isDesktop && mobileNCharWidth && wordmarkAvailableWidth
      ? Math.max(
          0,
          Math.floor(
            (wordmarkAvailableWidth - nonBaseWidth - studioSuffixWidth) /
              mobileNCharWidth,
          ),
        )
      : 0;
  $: nonText = "n".repeat(mobileNCount) + "non";

  function handleWheel(e) {
    if (!isDesktop || !availableWidth) return;
    e.preventDefault();

    const atRightEdge =
      wordmarkAvailableWidth &&
      shannonWidth >= wordmarkAvailableWidth - minWidth;

    if (atRightEdge && e.deltaY > 0) {
      rightOverpull += e.deltaY;
      if (rightOverpull >= overpullThreshold) {
        nsVisible = false;
      }
    } else {
      rightOverpull = 0;
    }

    const newOffset = clamp(
      offset + e.deltaY,
      minWidth - half,
      availableWidth - minWidth - half,
    );

    if (newOffset === offset) return;

    if (introPlaying) {
      clearInterval(introInterval);
      introPlaying = false;
    }

    offset = newOffset;
  }

  onMount(async () => {
    updateMeasurements();
    window.addEventListener("resize", updateMeasurements);
    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("wheel", resetTapZone, { passive: true });
    window.addEventListener("scroll", resetTapZone, { passive: true });

    await tick();
    if (isDesktop) {
      playIntro(fillCount);
    } else {
      introPlaying = false;
    }

    return () => {
      window.removeEventListener("resize", updateMeasurements);
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("wheel", resetTapZone);
      window.removeEventListener("scroll", resetTapZone);
      if (introInterval) clearInterval(introInterval);
      if (mobileFillInterval) clearInterval(mobileFillInterval);
    };
  });
</script>

<div class="main">
  <div class="wordmark" bind:this={wordmarkEl} bind:clientWidth={wordmarkWidth}>
    <div class="shannon" style={shannonStyle}>
      <span class="shan-desktop" bind:this={shanDesktopEl}
        >{shanDesktopText}</span
      >
    </div>

    <div class="studio" style={studioStyle} on:click={toggleMobileFill}>
      <span class="non" bind:this={nonEl}>{nonText}</span>
      <span class="studio">Studio</span>
    </div>
  </div>

  <main class="content" bind:this={contentEl} bind:clientWidth={containerWidth}>
    <div class="text-column" style={textStyle}>
      <div class="text-main"
        ><p>
          A digital and physical design practice by Shannon Lin. Current and
          past collaborators include The New York Times, Netflix, The Atlantic,
          Base Design, Porto Rocha, The Office Arts, The Canada Pavilion at the
          Venice Biennial, Middlebrow Podcast, Feed Me...
        </p>
        <p>
          Web design & development, art direction, branding, graphic design,
          interaction design, creative strategy and more.
        </p></div
      >

      <div
        class="tap-zone tap-zone-desktop"
        bind:this={tapZoneDesktopEl}
        on:click={handleDesktopTapZoneClick}
      >
        {#if isDesktop && clickStep >= 1}
          <a
            class="floating-label"
            href="https://www.instagram.com/swl_at_gmail_dot_com/"
            style="left: {instagramPos.x}px; top: {instagramPos.y}px;"
            on:click={(e) => e.stopPropagation()}
            in:receive={{ key: "instagram-desktop" }}
            out:send={{ key: "instagram-desktop" }}>Instagram</a
          >
        {/if}
        {#if isDesktop && clickStep >= 2}
          <a
            class="floating-label"
            href="mailto:shannon.w.lin424@gmail.com"
            style="left: {emailPos.x}px; top: {emailPos.y}px;"
            on:click={(e) => e.stopPropagation()}
            in:receive={{ key: "email-desktop" }}
            out:send={{ key: "email-desktop" }}>Email</a
          >
        {/if}
        {#if isDesktop && clickStep >= 3}
          <a
            class="floating-label"
            href="https://www.are.na/shannon-lin/channels"
            style="left: {arenaPos.x}px; top: {arenaPos.y}px;"
            on:click={(e) => e.stopPropagation()}
            in:receive={{ key: "arena-desktop" }}
            out:send={{ key: "arena-desktop" }}>Are.na</a
          >
        {/if}
      </div>

      <footer class="footer-desktop">
        {#if isDesktop && clickStep < 1}
          <a
            class="instagram-link"
            href="https://www.instagram.com/swl_at_gmail_dot_com/"
            in:receive={{ key: "instagram-desktop" }}
            out:send={{ key: "instagram-desktop" }}>Instagram</a
          >
        {/if}
        {#if isDesktop && clickStep < 2}
          <a
            class="email-link"
            href="mailto:shannon.w.lin424@gmail.com"
            in:receive={{ key: "email-desktop" }}
            out:send={{ key: "email-desktop" }}>Email</a
          >
        {/if}
        {#if isDesktop && clickStep < 3}
          <a
            class="arena-link"
            href="https://www.are.na/shannon-lin/channels"
            in:receive={{ key: "arena-desktop" }}
            out:send={{ key: "arena-desktop" }}>Are.na</a
          >
        {/if}
      </footer>
    </div>

    <div
      class="tap-zone tap-zone-mobile"
      bind:this={tapZoneMobileEl}
      on:click={handleMobileTapZoneClick}
    >
      {#if !isDesktop && clickStep >= 1}
        <a
          class="floating-label"
          href="https://www.instagram.com/swl_at_gmail_dot_com/"
          style="left: {instagramPos.x}px; top: {instagramPos.y}px;"
          on:click={(e) => e.stopPropagation()}
          in:receive={{ key: "instagram-mobile" }}
          out:send={{ key: "instagram-mobile" }}>Instagram</a
        >
      {/if}
      {#if !isDesktop && clickStep >= 2}
        <a
          class="floating-label"
          href="mailto:shannon.w.lin424@gmail.com"
          style="left: {emailPos.x}px; top: {emailPos.y}px;"
          on:click={(e) => e.stopPropagation()}
          in:receive={{ key: "email-mobile" }}
          out:send={{ key: "email-mobile" }}>Email</a
        >
      {/if}
      {#if !isDesktop && clickStep >= 3}
        <a
          class="floating-label"
          href="https://www.are.na/shannon-lin/channels"
          style="left: {arenaPos.x}px; top: {arenaPos.y}px;"
          on:click={(e) => e.stopPropagation()}
          in:receive={{ key: "arena-mobile" }}
          out:send={{ key: "arena-mobile" }}>Are.na</a
        >
      {/if}
    </div>

    <footer class="footer-mobile">
      {#if !isDesktop && clickStep < 1}
        <a
          class="instagram-link"
          href="https://www.instagram.com/swl_at_gmail_dot_com/"
          in:receive={{ key: "instagram-mobile" }}
          out:send={{ key: "instagram-mobile" }}>Instagram</a
        >
      {/if}
      {#if !isDesktop && clickStep < 2}
        <a
          class="email-link"
          href="mailto:shannon.w.lin424@gmail.com"
          in:receive={{ key: "email-mobile" }}
          out:send={{ key: "email-mobile" }}>Email</a
        >
      {/if}
      {#if !isDesktop && clickStep < 3}
        <a
          class="arena-link"
          href="https://www.are.na/shannon-lin/channels"
          in:receive={{ key: "arena-mobile" }}
          out:send={{ key: "arena-mobile" }}>Are.na</a
        >
      {/if}
    </footer>

    <video
      class="placeholder"
      style={placeholderStyle}
      src="/main-video.mp4"
      autoplay
      muted
      loop
      playsinline
    ></video>
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
    /* font-weight: bold; */
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
  .shan-desktop {
    display: none;
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
  }

  .tap-zone {
    position: relative;
    cursor: pointer;
  }
  .tap-zone-desktop {
    display: none;
  }
  .tap-zone-mobile {
    flex: 1;
    min-height: 0;
  }
  .floating-label {
    position: absolute;
    transform: translate(-50%, -50%);
    white-space: nowrap;
  }
  .text-main {
    padding-top: 10px;
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
    overflow: hidden;
  }
  /* footer */
  .footer-mobile {
    grid-area: footer;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    flex: 0 0 auto;
    margin-top: 30px;
    padding-bottom: 10px;
  }
  .footer-desktop {
    display: none;
  }
  .instagram-link {
    grid-column: 1;
    justify-self: start;
  }
  .email-link {
    grid-column: 2;
    justify-self: center;
  }
  .arena-link {
    grid-column: 3;
    justify-self: end;
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
      display: inline-block;
      overflow: hidden;
      white-space: nowrap;
      vertical-align: top;
      max-width: 100%;
    }
    .studio {
      display: flex;
      justify-content: space-between;
      cursor: default;
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
    }
    .text-main {
      padding-top: 0;
      padding-right: 10px;
    }
    .tap-zone-desktop {
      display: block;
      flex: 1;
      min-height: 0;
    }
    .tap-zone-mobile {
      display: none;
    }
    .placeholder {
      width: auto;
      aspect-ratio: auto;
      height: auto;
      min-height: 80vh;
      max-height: 85vh;
    }

    .footer-mobile {
      margin-top: 0;
      display: none;
    }
    .footer-desktop {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      padding-right: 10px;
    }
  }
</style>
