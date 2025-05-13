<script>
  import { fade } from "svelte/transition";
  import { tick } from "svelte";

  import Papa from "papaparse";
  import { onMount, onDestroy } from "svelte";
  import { fontStyle, tags, view, projects_data } from "./stores.js";
  import Project from "./project.svelte";

  $: style = `font-size: ${$fontStyle.size}px;
              font-weight: ${$fontStyle.bold ? "bold" : "normal"};
              font-style: ${$fontStyle.italic ? "italic" : "normal"};
              text-decoration: ${$fontStyle.underline ? "underline" : "none"};`;

  let projects = [];
  let projects_els = [];

  $: all_tags = $tags;
  let transitioning = false;
  let currentView = $view;
  let previousView = $view;

  $: if ($view !== previousView) {
    // console.log("Switch");
    previousView = currentView;
    currentView = $view;
    transitionViews();
  }
  async function transitionViews() {
    transitioning = true;
    // console.log(transitioning);
    await tick();
    await new Promise((r) => setTimeout(r, projects.length * 100 + 300));
    previousView = $view;
    transitioning = false;
    // console.log(transitioning);
  }

  // let y;

  // let showOverlay = false;

  onMount(async () => {
    const projects_res = await fetch(
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vTZMTayJHqlx_4IXHlQ_TdvM6hA6P34Mo7t53ziC1lDYzewBezEmv7rcsZFvdXPLU6qebcTWn_Y8-FV/pub?gid=974648717&single=true&output=csv"
    );
    const projects_text = await projects_res.text();

    const projects_parsed = Papa.parse(projects_text, {
      header: true,
      skipEmptyLines: true,
    });

    projects = projects_parsed.data;
    projects_data.set(projects);
    // console.log(projects);
  });
</script>

<svelte:window />
<!-- onmouseenter={handleMouseEnter} -->
{#if projects.length}
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div class="all-projects {$view}">
    {#each projects as project, i (project.title)}
      <Project {project} {i} {transitioning} {currentView} {previousView} />
    {/each}
  </div>
{:else}
  <!-- <p>Loading...</p> -->
{/if}

<style>
  .all-projects {
    overflow: hidden;
    padding: 20px;
  }
  .grid {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    min-height: 100vh;
    /* grid-template-rows: repeat(8, 15vh); */

    grid-gap: 10px;
    margin-bottom: 100px;
  }
  @media (min-width: 740px) {
    .grid {
      grid-template-columns: repeat(16, 1fr);
      grid-template-rows: repeat(19, 12vh);
    }
  }
  @media (min-width: 1040px) {
    .grid {
      grid-template-columns: repeat(16, 1fr);
      grid-template-rows: repeat(19, 22vh);
    }
  }
</style>
