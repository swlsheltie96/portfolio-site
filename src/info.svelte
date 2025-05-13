<script>
  import Papa from "papaparse";
  import { onMount, tick } from "svelte";
  import { fontStyle, tags, view, collapseAll, showTags, selectedTag } from "./stores.js";
  import Music from "./music.svelte";

  let isExpanded = false;
  let currentSongTitle;

  function toggleView() {
    view.update((current) => {
      const newView = current === "grid" ? "list" : "grid";
      if (newView === "list") {
        showTags.set(true);
        collapseAll.set(true);
        isExpanded = false;
      }
      return newView;
    });
  }

  function toggleExpand() {
    isExpanded = !isExpanded;
    console.log("expand", isExpanded);
    if (!isExpanded) {
      console.log("play ");
      playGif();
    }
    collapseAll.set(!isExpanded);
  }

  function toggleTags() {
    showTags.update((current) => !current);
  }

  function handleTagClick(tag) {
    selectedTag.update((current) => (current === tag ? null : tag));
  }

  $: style = `font-size: ${$fontStyle.size}px;
              font-weight: ${$fontStyle.bold ? "bold" : "normal"};
              font-style: ${$fontStyle.italic ? "italic" : "normal"};
              text-decoration: ${$fontStyle.underline ? "underline" : "none"};`;

  $: info = [];
  $: info_els = [];
  $: all_tags = $tags;

  function handleDuplicateClick(index) {
    info = info.map((item, i) => {
      if (i === index) {
        console.log(item);
        return {
          ...item,
          duplicate: (parseInt(item.duplicate) || 0) + 1,
        };
      }
      return item;
    });
  }

  function getShiftXY(index) {
    if (window.innerWidth < 740) {
      return { xShift: 0, yShift: 0 };
    }
    const screenWidth = window.innerWidth;
    // console.log(screenWidth);
    const x = Number(info[index]?.x);
    const width = Number(info[index]?.width);

    if (isNaN(x) || isNaN(width)) return { xShift: 0, yShift: 0 };

    const overflow = x + width - screenWidth + 20;
    const xShift = overflow > 0 ? -overflow : 0;

    // Count how many elements before this one have been shifted
    let shiftedBefore = 1;
    for (let j = 0; j < index; j++) {
      const prev = info[j];
      const prevOverflow = Number(prev?.x) + Number(prev?.width) - screenWidth;
      if (prevOverflow > 0) shiftedBefore++;
    }

    // Apply a logarithmic Y offset
    const yShift = xShift !== 0 ? Math.log(shiftedBefore + 1) * 100 : 0;

    return { xShift, yShift };
  }

  async function updateRects() {
    await tick(); // wait for DOM to update
    info = info.map((el, i) => {
      info_els[i].style.transform = "none";
      void el.offsetHeight;
      const rect = info_els[i]?.getBoundingClientRect() || {};

      return {
        ...el,
        x: rect.x ?? 0,
        width: rect.width ?? 0,
      };
    });
  }
  onMount(async () => {
    const info_res = await fetch(
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vTZMTayJHqlx_4IXHlQ_TdvM6hA6P34Mo7t53ziC1lDYzewBezEmv7rcsZFvdXPLU6qebcTWn_Y8-FV/pub?gid=0&single=true&output=csv"
    );
    const info_text = await info_res.text();

    const info_parsed = Papa.parse(info_text, {
      header: true,
      skipEmptyLines: true,
    });

    info = info_parsed.data;
    // console.log(info);

    updateRects();
    window.addEventListener("resize", () => {
      updateRects();
      for (let i = 0; i < info.length; i++) {
        // console.log("hello");

        getShiftXY(i);
      }
    });
  });

  function increaseSize() {
    fontStyle.update((style) => {
      return { ...style, size: style.size + 1 };
    });
  }

  function decreaseSize() {
    fontStyle.update((style) => {
      return { ...style, size: style.size - 1 };
    });
  }

  function toggleBold() {
    fontStyle.update((style) => {
      return { ...style, bold: !style.bold };
    });
  }

  function toggleItalic() {
    fontStyle.update((style) => {
      return { ...style, italic: !style.italic };
    });
  }
  function toggleUnderline() {
    fontStyle.update((style) => {
      return { ...style, underline: !style.underline };
    });
  }

  let playing = false;

  function playGif() {
    if (!playing) {
      playing = true;
      collapseAll.set(true);

      // Optional: hide the GIF after it finishes playing (e.g., 3s)
      setTimeout(() => {
        playing = false;
      }, 1160); // change to match your GIF duration
    } else {
      ("still playing");
    }
  }

  let audioPlayer;
  let isPlaying = false;
  let currentTime = 0;
  let duration = 0;

  onMount(() => {
    audioPlayer = document.getElementById("audio-player");

    audioPlayer.addEventListener("timeupdate", () => {
      currentTime = audioPlayer.currentTime;
    });

    audioPlayer.addEventListener("loadedmetadata", () => {
      duration = audioPlayer.duration;
    });

    audioPlayer.addEventListener("ended", () => {
      isPlaying = false;
      currentTime = 0;
    });
  });
</script>

{#if playing}
  <div class="bless">
    <img src="/other_assets/maple-animation-black-transparent.gif" alt="GIF" />
  </div>
{/if}
<div class="button-set">
  <div class="project-settings">
    <button id="view-type" class="sort" {style} on:click={toggleView}
      >{$view === "grid" ? "list view" : "grid view"}</button
    >
    {#if $view === "grid"}
      <button id="show-tags" class="sort" {style} on:click={toggleTags}>
        {$showTags ? "hide tags" : "show tags"}
      </button>
    {/if}

    {#if $view === "list"}
      <button id="collapse" class="sort" {style} on:click={toggleExpand}>
        {isExpanded ? "collapse all" : "expand all"}
      </button>
    {/if}
  </div>
  <div class="music-desktop">
    <Music bind:currentSongTitle />
  </div>
  <div class="font-settings">
    <button id="button-increase" style="font-size: {$fontStyle.size}px" on:click={increaseSize}
      >+</button
    >
    <button id="button-decrease" style="font-size: {$fontStyle.size}px" on:click={decreaseSize}
      >–</button
    >
    <button id="button-bold" style="font-size: {$fontStyle.size}px" on:click={toggleBold}>B</button>
    <button id="button-italic" style="font-size:{$fontStyle.size}px" on:click={toggleItalic}
      >I</button
    >

    <button id="button-underline" style="font-size: {$fontStyle.size}px" on:click={toggleUnderline}
      >U</button
    >
  </div>
</div>

{#if info.length}
  <div class="information-section">
    {#each info as bio, i}
      <!-- {bio.duplicate} -->
      <div class="info-section" bind:this={info_els[i]}>
        <!--    style="transform: translate({getShiftXY(i).xShift}px, {getShiftXY(i).yShift}px)" -->
        <!-- <div> -->

        <!--  width: {Number(info[i].width).toFixed(2)} -->
        <!-- </div> -->
        {#each [...Array(parseInt(bio.duplicate)).keys()] as j}
          <div
            class="info-unit info-{bio.title} duplicate-{j}"
            on:click={() => window.innerWidth < 740 && handleDuplicateClick(i)}
            on:mouseover={() => window.innerWidth >= 740 && handleDuplicateClick(i)}
          >
            <p class="info-p" {style}>
              {bio.text}
              {#if bio.title == "reachable"}
                <a href="mailto:{bio.email}"> {bio.email}</a>
              {/if}
              {#if i === info.length - 1 && currentSongTitle}
                <span class="song-title"> {currentSongTitle}</span>
              {/if}
            </p>
          </div>
        {/each}
        <span {style} class="el-metadata x">x: {Number(info[i].x).toFixed(2)}</span>
      </div>
    {/each}
  </div>
{:else}
  <p style="{style}; margin-top:60px;margin-left: 20px">woolgathering... ◌</p>
{/if}
<div class="music-mobile">
  <Music bind:currentSongTitle />
</div>
<div class="line"></div>
<div class="project-settings" {style}></div>
<div class="tags">
  {#each Object.entries(all_tags) as [key, tag]}
    <button
      id="tag-{tag}"
      class="tag"
      style="{style}; background-color: {tag.color}; opacity: {$selectedTag &&
      $selectedTag !== tag.label
        ? '0.3'
        : '1'}"
      on:click={() => handleTagClick(tag.label)}>{tag.label}</button
    >
  {/each}
</div>

<style>
  .bless {
    position: fixed;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .bless img {
    width: auto;
    height: 100%;
  }
  .all-info {
    padding: 20px;
    padding-bottom: 0;
  }
  .information-section {
    display: flex;
    gap: 10px;

    flex-direction: column;
    padding: 20px;
    padding-bottom: 10px;
    padding-top: 60px;
  }
  @media (min-width: 740px) {
    .information-section {
      flex-direction: row;
      padding-bottom: 20px;
      /* height: 20vh; */
      flex-wrap: wrap;
    }
  }
  .info-unit {
    cursor: pointer;
  }

  .info-p {
    /* white-space: nowrap; */
  }
  @media (min-width: 740px) {
    .info-p {
      white-space: nowrap;
    }
  }
  .button-set {
    width: calc(100% - 40px);
    position: fixed;
    right: 20px;
    top: 20px;
    display: flex;
    gap: 5px;
    justify-content: space-between;
    z-index: 2;
  }

  button {
    outline: none;
  }

  button:focus {
    outline: none;
  }

  #button-bold {
    font-weight: 900;
  }
  #button-italic {
    font-style: italic;
  }
  #button-underline {
    text-decoration: underline;
  }
  .el-metadata {
    display: none;
    border-radius: 2px;
    padding: 3px 5px;
    background-color: yellow;
  }
  @media (min-width: 740px) {
    .el-metadata {
      display: inline;
    }
  }
  .line {
    width: calc(100% - 40px);
    border-top: 1px solid black;
    margin: auto;
    margin-bottom: 20px;
  }

  .settings {
    display: inline-flex;
    gap: 5px;
    /* margin-bottom: 20px;
    margin-top: 20px; */
  }

  .tags {
    display: flex;
    gap: 5px;
    width: calc(100% - 40px);
    margin: auto;
  }
  .tag {
    border: none;
  }
  .music-desktop {
    display: none;
  }
  .music-mobile {
    /* position: fixed; */
    /* top: 50px;
    left: 20px; */
    width: calc(100% - 40px);
    margin: auto;
    margin-bottom: 10px;
  }

  @media (min-width: 740px) {
    .music-desktop {
      flex-grow: 1;
      display: block;
    }
    .music-mobile {
      display: none;
    }
  }
</style>
