<script>
  import { fade, fly } from "svelte/transition";
  import { cubicOut, cubicIn } from "svelte/easing";
  import { fetchArchieml } from "./utils/loadAML.js";
  import { onMount } from "svelte";
  import Papa from "papaparse";
  import { projects_data, view } from "./stores.js";
  import TextContent from "./components/TextContent.svelte";
  import MediaContent from "./components/MediaContent.svelte";

  export let hoveredProject;
  export let activeProject;
  export let clearSelection;
  export let handleScroll;
  export let closeButton;
  export let fontStyle;

  let text_data;
  let project_data;
  let currentProjectSections = [];

  $: if (activeProject && text_data && text_data.all_projects) {
    // console.log(text_data);
    let foundProject = null;
    for (const projectObj of text_data.all_projects) {
      if (projectObj.type === "project") {
        const project = projectObj.value.find((p) => p.slug === activeProject.project);
        if (project) {
          foundProject = project;
          project_data = foundProject;
          break;
        }
      }
    }
    currentProjectSections = foundProject ? foundProject.sections : [];
    // console.log(foundProject, currentProjectSections);
  }

  $: style = `font-size: ${$fontStyle.size}px;
              font-weight: ${$fontStyle.bold ? "bold" : "normal"};
              font-style: ${$fontStyle.italic ? "italic" : "normal"};
              text-decoration: ${$fontStyle.underline ? "underline" : "none"};`;

  $: vartop = `${$fontStyle.size}px`;

  onMount(async () => {
    const url =
      "https://docs.google.com/document/d/e/2PACX-1vQrYjQShcwtouGPacJE2AnNMltgw2km9dzHEhnf3y5vW4KAsynpT-zc2SWuRaDcW2KH6eBHkeXJ3oOH/pub";
    text_data = await fetchArchieml(url);
    // console.log(text_data);
  });
</script>

{#if hoveredProject && !activeProject && $view === "grid"}
  <div
    class="overlay"
    style="--max-width: {hoveredProject.desktop_max_width
      ? hoveredProject.desktop_max_width
      : 'calc(100% - 40px)'}"
  >
    <div class="info">
      <p class="project-title" {style}>{hoveredProject.title}</p>
      <p {style}>{hoveredProject.type}</p>
      <p {style}>{hoveredProject.client}</p>
      <p {style}>{hoveredProject.year}</p>
    </div>
  </div>
{/if}
{#if activeProject && $view === "grid"}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    class="overlay-backdrop {activeProject.project}"
    on:click={clearSelection}
    on:scroll={handleScroll}
  >
    <div class="bkg-opacity" transition:fade={{ duration: 300 }}></div>

    <div class="overlay-scroll" in:fly={{ y: 600, duration: 350, opacity: 1, easing: cubicOut }} out:fly={{ y: 600, duration: 350, opacity: 1, easing: cubicIn }} on:click|stopPropagation>
      <div
        class="info"
        style="--max-width: {activeProject.desktop_max_width
          ? activeProject.desktop_max_width
          : 'calc(100% - 40px)'}"
        on:click|stopPropagation
      >
        <div class="project-header">
          <div class="project-data">
            <p class="project-title" {style}>
              <a target="_blank" href={activeProject.url}>{activeProject.title}</a>
            </p>
            <p {style}>{activeProject.type}</p>
            <p {style}>{activeProject.client}</p>
            <p {style}>{activeProject.year}</p>
          </div>

          <div class="button-wrapper">
            <button {style} class="close" bind:this={closeButton} on:click={clearSelection}
              >Close</button
            >
          </div>
        </div>
                <!-- <div class="scroll-indicator" {style}>Scroll <span class="arrow">↓</span></div> -->

        <div class="project-description">
          {#each currentProjectSections as section}
            {#if section.type === "text"}
              <div class="single text {project_data.media_type || ''}">
                <TextContent text={section.value} {style} />
              </div>
            {:else if section.type === "diptych"}
              {#each section.value as item}
                <div class="diptych-item" style="--top: {vartop}">
                  {#if item.type === "text"}
                    <TextContent text={item.value} {style} />
                  {:else if item.type === "media"}
                    <MediaContent media={item.value} />
                  {/if}
                </div>
              {/each}
            {:else if section.type === "media"}
              <div class="single media {project_data.media_type || ''}">
                <MediaContent media={section.value} device={project_data.media_type} />
              </div>
            {/if}
          {/each}
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  .overlay-backdrop {
    position: fixed;
    inset: 0;
    z-index: 2;
  }

  .overlay {
    position: fixed;
    top: calc(100vh - 40px - (14px * 4));
    right: 0;
    width: 100%;
    background: white;
    color: black;
    padding: 20px;
    box-sizing: border-box;
    z-index: 100;
    font-size: 12px;
    border: 1px solid black;

    margin-right: 20px;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    /* width: var(--max-width); */
    width: calc(100% - 40px);
    max-width: 850px;
  }

  .overlay-scroll {
    position: fixed;
    top: 20px;
    bottom: 0;
    right: 0;
    width: calc(100% - 40px);
    max-width: 850px;
    overflow-y: auto;
  }

  .overlay-scroll .info {
    font-size: 12px;
    padding: 20px;
    padding-top: 0;
    background: white;
    position: relative;

    width: calc(100%);
    box-sizing: border-box;

    border-top: 1px solid black;
    min-height: calc(100vh - 20px);
  }
  @media (min-width: 740px) {
    .overlay-scroll .info {
      margin-left: auto;
      margin-right: 20px;
      border-top-left-radius: 5px;
      border-top-right-radius: 5px;
      width: calc(100% - 40px);
      max-width: 850px;

      border-left: 1px solid black;
      border-right: 1px solid black;
    }
  }
  .overlay .info {
    max-width: 850px;
    margin: 0;
  }

  .bkg-opacity {
    position: fixed;
    width: 100%;
    height: 100vh;
    background-color: white;
    pointer-events: none;
    z-index: 0;
    opacity: 0.8;
  }

  .project-header {
    display: flex;
    justify-content: space-between;
    /* position: sticky;
    top: 0; */
    /* background-color: white; */
    padding-top: 20px;
    z-index: 1;
  }
  .project-data {
    background-color: white;
    border-radius: 5px;
  }
  .info .project-title {
    text-decoration: underline !important;
  }
  .project-description {
    padding-top: 20px;
  }
  .videos {
    /* display: flex; */
    /* flex-direction: column; */
    /* align-items: flex-end; */
  }
  video {
    max-width: 400px;
  }

  .diptych {
    /* display: flex; */
    /* flex-direction: column; */
    gap: 20px;
    margin-bottom: 20px;
  }
  .single {
    width: fit-content;
    margin-bottom: 20px;
  }
  .single:last-child {
    margin-bottom: 0;
  }
  .single.media {
    /* margin-left: auto; */
  }
  .single.media.desktop {
    width: 100%;
  }

  .diptych-item:first-child {
    margin-bottom: 20px;
  }
  .diptych-item:nth-child(2) {
    margin-bottom: 20px;
  }

  .scroll-indicator {
    z-index: 3;
    margin-top: 20px;
  }

  .arrow {
    display: inline-block;
    animation: bounce 1.5s infinite;
  }

  @keyframes bounce {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-5px);
    }
  }
</style>
