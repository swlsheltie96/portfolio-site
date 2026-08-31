<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { page } from "$app/state";
  import { layoutState } from "$lib/state/layout.svelte";
  import { brushState } from "$lib/state/brush.svelte";
  import { mirrorState } from "$lib/state/mirror.svelte";
  import { clearState } from "$lib/state/clear.svelte";
  import { radioState } from "$lib/state/radio.svelte";
  import { viewportState } from "$lib/state/viewport.svelte";

  let debugOn = $state(false);
  let typeface: "sans" | "serif" = $state("sans");
  let navEl: HTMLElement | undefined = $state();
  let toolsOpen = $state(false);

  const homeText = "s-w-l";
  let homeDisplayText = $state(homeText.toUpperCase());
  let homeCycleInterval: ReturnType<typeof setInterval> | undefined;

  function randomizeCase(text: string) {
    return text
      .split("")
      .map((char) =>
        Math.random() < 0.5 ? char.toLowerCase() : char.toUpperCase(),
      )
      .join("");
  }

  function startHomeCycle() {
    clearInterval(homeCycleInterval);
    homeCycleInterval = setInterval(() => {
      homeDisplayText = randomizeCase(homeText);
    }, 100);
  }

  function stopHomeCycle() {
    clearInterval(homeCycleInterval);
    homeCycleInterval = undefined;
    homeDisplayText = homeText.toUpperCase();
  }

  onDestroy(() => clearInterval(homeCycleInterval));

  const ONLINE_COUNT_MIN = 500;
  const ONLINE_COUNT_MAX = 5_000_000;
  const ONLINE_COUNT_RAMP = 100;
  const ONLINE_COUNT_DURATION_MS = 600;

  const finalOnlineCount =
    Math.floor(Math.random() * (ONLINE_COUNT_MAX - ONLINE_COUNT_MIN + 1)) + ONLINE_COUNT_MIN;
  let onlineCount = $state(finalOnlineCount - ONLINE_COUNT_RAMP);

  onMount(() => {
    const startValue = finalOnlineCount - ONLINE_COUNT_RAMP;
    const startTime = performance.now();

    function tick(now: number) {
      const progress = Math.min((now - startTime) / ONLINE_COUNT_DURATION_MS, 1);
      onlineCount = Math.round(startValue + ONLINE_COUNT_RAMP * progress);
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  });

  let statusText = $derived(`${onlineCount.toLocaleString()} online`);

  function toggleDebug() {
    debugOn = !debugOn;
    document.documentElement.dataset.debug = debugOn ? "true" : "false";
  }

  function toggleTypeface() {
    typeface = typeface === "sans" ? "serif" : "sans";
    if (typeface === "serif") {
      document.documentElement.dataset.typeface = "serif";
    } else {
      delete document.documentElement.dataset.typeface;
    }
  }

  const FONT_SIZE_MIN = 10;
  const FONT_SIZE_MAX = 32;
  const FONT_SIZE_STEP = 1;

  const LINE_HEIGHT_MIN = 12;
  const LINE_HEIGHT_MAX = 34;

  let bodyFontSize = $state(16);
  let bodyLineHeight = $state(18);

  function clamp(value: number, min: number, max: number) {
    return Math.min(max, Math.max(min, value));
  }

  function adjustFontSize(delta: number) {
    bodyFontSize = clamp(bodyFontSize + delta, FONT_SIZE_MIN, FONT_SIZE_MAX);
    bodyLineHeight = clamp(
      bodyLineHeight + delta,
      LINE_HEIGHT_MIN,
      LINE_HEIGHT_MAX,
    );
    document.documentElement.style.setProperty(
      "--font-size-body",
      `${bodyFontSize}px`,
    );
    document.documentElement.style.setProperty(
      "--line-height-body",
      `${bodyLineHeight}px`,
    );
  }

  $effect(() => {
    if (!navEl) return;

    const setNavbarHeight = () => {
      document.documentElement.style.setProperty(
        "--navbar-height",
        `${navEl!.offsetHeight}px`,
      );
    };

    setNavbarHeight();

    const observer = new ResizeObserver(setNavbarHeight);
    observer.observe(navEl);

    return () => observer.disconnect();
  });
</script>

<nav bind:this={navEl}>
  <div class="nav-bar col-20 col-tablet-10 col-mobile-5">
    <div class="main nav-inner">
      <a
        class="button"
        href="/"
        onclick={(e) => {
          if (page.url.pathname === "/") {
            e.preventDefault();
            window.location.reload();
          }
        }}
        onmouseenter={startHomeCycle}
        onmouseleave={stopHomeCycle}
        ><span class="home-cycle">{homeDisplayText}</span> studio</a
      >
      {#if page.url.pathname === "/" && !viewportState.isMobile}
        <button class="button" onclick={() => layoutState.next()}>
          Layout {layoutState.index + 1}
        </button>
      {/if}
      {#if page.data.project}
        <span class="button">{page.data.project.title}</span>
      {/if}
    </div>

    <div class="secondary nav-inner" class:tools-open={toolsOpen}>
      <span class="button status-button status-button-desktop">
        <span class="status-dot"></span>
        {statusText}
      </span>
      <button
        class="button"
        class:active={toolsOpen}
        onclick={() => (toolsOpen = !toolsOpen)}>Tools</button
      >
      <div class="secondary-buttons">
        <button class="button" onclick={() => radioState.toggle()}>
          {radioState.isPlaying
            ? `⏸️ ${radioState.currentSongTitle}`
            : `▶️ ${radioState.currentSongTitle}`}
        </button>
        <button
          class="button"
          class:active={brushState.active}
          onclick={(e) => {
            e.stopPropagation();
            brushState.active = true;
          }}>Brush</button
        >
        <button
          class="button"
          class:active={clearState.active}
          onclick={(e) => {
            e.stopPropagation();
            clearState.active = true;
          }}>Clear</button
        >
        <!-- <button class="button">Redact</button>

				<button class="button">Physics</button>
				<button class="button">Colors</button>
				<button class="button">Clear</button> -->
        <button
          class="button"
          class:active={mirrorState.active}
          onclick={() => mirrorState.toggle()}>Mirror</button
        >
        <button class="button" class:active={debugOn} onclick={toggleDebug}
          >Grid</button
        >
        <a
          class="button"
          href="https://swl-studio-v25.netlify.app/old-2-25.html"
          target="_blank"
          rel="noopener noreferrer">v25</a
        >
        <div class="type-controls">
          <button class="button" onclick={toggleTypeface}
            >{typeface === "serif" ? "T" : "T"}</button
          >
          <button class="button" onclick={() => adjustFontSize(FONT_SIZE_STEP)}
            >+</button
          >
          <button class="button" onclick={() => adjustFontSize(-FONT_SIZE_STEP)}
            >-</button
          >
        </div>
      </div>
    </div>
  </div>
</nav>

<style>
  nav {
    position: sticky;
    top: var(--spacing);
    /* border-bottom: 1px solid black; */
    /* padding-bottom: var(--spacing); */
    z-index: 10;
    margin-bottom: var(--spacing-sm);
  }
  nav a,
  nav button,
  nav select {
    pointer-events: auto;
  }
  .nav-bar {
    display: flex;
    justify-content: space-between;
  }
  .nav-inner {
    display: flex;
    gap: var(--spacing);
  }

  .type-controls {
    display: flex;
    gap: var(--spacing);
  }

  .button.active {
    background: black;
    color: white;
    border: solid 1px #3c3c3c;
  }

  .home-cycle {
    text-transform: none;
  }

  .status-button {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  /* display:contents makes this wrapper invisible to layout by default, so
	   its buttons act as direct .secondary flex items — this is what keeps
	   the mobile column (each button its own row) working unchanged. The
	   desktop collapse/expand below overrides this only at desktop widths. */
  .secondary-buttons {
    display: contents;
  }

  @media (min-width: 750px) {
    .secondary-buttons {
      display: none;
      gap: var(--spacing);
    }
    .secondary.tools-open .secondary-buttons {
      display: flex;
    }
  }

  .status-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #2ecc71;
    flex-shrink: 0;
  }

  @media (max-width: 749px) {
    .nav-bar {
      flex-wrap: wrap;
      row-gap: var(--spacing-sm);
    }
    .nav-inner {
      flex-wrap: wrap;
    }
    .main {
      width: 100%;
      justify-content: space-between;
    }

    .status-button-desktop {
      display: none;
    }

    /* The collapsible button list: right-aligned column, hidden until the
		   mobile status pill (tapped as the open/close toggle) sets tools-open.
		   flex-basis: 100% forces it onto its own row below .main / the pill. */
    .secondary {
      display: none;
      flex-direction: column;
      align-items: flex-end;
      flex-basis: 100%;
    }
    .secondary.tools-open {
      display: flex;
    }
  }
</style>
