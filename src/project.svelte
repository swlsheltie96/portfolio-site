<script>
  import { fade, slide } from "svelte/transition";
  import { cubicOut, cubicIn, cubicInOut, linear } from "svelte/easing";
  export let project;
  export let i;
  import { onMount, onDestroy } from "svelte";
  import { fontStyle, tags, view, collapseAll, showTags, selectedTag } from "./stores.js";
  import ProjectOverlay from "./ProjectOverlay.svelte";
  import TextContent from "./components/TextContent.svelte";
  import MediaContent from "./components/MediaContent.svelte";
  import { fetchArchieml } from "./utils/loadAML.js";

  export let currentView;
  export let previousView;
  export let transitioning;
  $: all_tags = $tags;
  $: style = `font-size: ${$fontStyle.size}px;
              font-weight: ${$fontStyle.bold ? "bold" : "normal"};
              font-style: ${$fontStyle.italic ? "italic" : "normal"};
              text-decoration: ${$fontStyle.underline ? "underline" : "none"};`;

  let hoveredProject = null;
  let activeProject = null;
  let closeButton;
  let proj_el;
  let proj_tags = project.tags.split(",").map((item) => item.trim());
  let text_data;
  let project_data;
  let currentProjectSections = [];

  $: isVisible = !$selectedTag || proj_tags.includes($selectedTag);

  $: if (activeProject && text_data && text_data.all_projects) {
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
  }

  function selectProject(project) {
    if (activeProject && activeProject.project === project.project) {
      activeProject = null;
    } else {
      plausible("Project Clicked", { props: { project: project } });
      activeProject = project;
    }
  }

  function clearSelection() {
    activeProject = null;
  }
  function handleKeydown(event) {
    if (event.key === "Escape") {
      clearSelection();
    }
  }

  onMount(async () => {
    window.addEventListener("keydown", handleKeydown);
    const url =
      "https://docs.google.com/document/d/e/2PACX-1vQrYjQShcwtouGPacJE2AnNMltgw2km9dzHEhnf3y5vW4KAsynpT-zc2SWuRaDcW2KH6eBHkeXJ3oOH/pub";
    text_data = await fetchArchieml(url);
  });

  onDestroy(() => {
    window.removeEventListener("keydown", handleKeydown);
  });

  $: {
    if (activeProject && $view === "grid") {
      const scrollbarWidth = getScrollbarWidth();
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      document.body.classList.add("overlay-active");
    } else {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
      document.body.classList.remove("overlay-active");
    }
  }
  function handleScroll(e) {
    if (activeProject) {
      // console.log(e.target);
      let overlay = e.target.querySelector(".overlay-scroll");
      let rect = overlay.getBoundingClientRect();
      // console.log(rect.top);
      if (closeButton) {
        if (rect.top < 0) {
          closeButton.style.position = "fixed";
          closeButton.style.right = 20 + getScrollbarWidth() + "px";
        } else {
          closeButton.style.position = "absolute";
          closeButton.style.right = "20px";
        }
      }
    }
  }
  function getScrollbarWidth() {
    const scrollDiv = document.createElement("div");
    scrollDiv.style.overflow = "scroll";
    scrollDiv.style.visibility = "hidden";
    scrollDiv.style.width = "100px";
    scrollDiv.style.position = "absolute";
    document.body.appendChild(scrollDiv);

    const scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;

    document.body.removeChild(scrollDiv);
    return scrollbarWidth;
  }

  $: if ($collapseAll) {
    activeProject = null;
  }

  $: if (!$collapseAll && $view === "list") {
    activeProject = project;
  }
</script>

<!-- svelte-ignore a11y_mouse_events_have_key_events -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->

<div
  class="project {$view}"
  id={project.project}
  style="--col-desktop: {project.col_desktop}; --col-mobile: {project.col_mobile};--row-desktop: {project.row_desktop};--row-mobile: {project.row_mobile}; display: {isVisible
    ? 'block'
    : 'none'}"
  on:mouseover={() => $view !== "list" && (hoveredProject = project)}
  on:mouseout={() => (hoveredProject = null)}
  on:click={() => selectProject(project)}
  bind:this={proj_el}
>
  <!-- <h2>{project.title}</h2> -->
  {#if $view == "grid"}
    <div
      class="grid-item"
      in:fade={{
        delay: transitioning ? i * 100 + 100 : 0,
        duration: 300,
      }}
    >
      <img
        src="https://pub-de90c051aa034ae4942bc22f6c3686f0.r2.dev/{project.thumb}"
        alt={project.title}
      />

      <div class="project-data">
        {#if proj_tags.length && $showTags}
          <div class="tags">
            {#each proj_tags as tag}
              {@const tag_name = Object.values(all_tags).find((t) => t.label === tag)?.label}
              <span
                style="{style}; background-color: {Object.values(all_tags).find(
                  (t) => t.label === tag
                )?.color}"
                class="tag {tag_name}">{tag_name}</span
              >
            {/each}
          </div>
        {/if}
      </div>
    </div>
  {:else if $view == "list"}
    <div
      class="list-item"
      in:fade={{
        delay: transitioning ? i * 100 : 0,
        duration: 300,
      }}
    >
      <img
        src="https://pub-de90c051aa034ae4942bc22f6c3686f0.r2.dev/{project.thumb}"
        alt={project.title}
      />
      <div class="project-data-container">
        <div class="project-data">
          {#if proj_tags.length && $showTags}
            <div class="tags">
              {#each proj_tags as tag}
                {@const tag_name = Object.values(all_tags).find((t) => t.label === tag)?.label}
                <span
                  style="{style}; background-color: {Object.values(all_tags).find(
                    (t) => t.label === tag
                  )?.color}"
                  class="tag {tag_name}">{tag_name}</span
                >
              {/each}
            </div>
          {/if}
          <div class="list-view info">
            <div class="info">
              <p class="project-title" {style}>
                <a target="_blank" href={project.url}>{project.title}</a>
              </p>
              <p {style}>{project.type}</p>
              <p {style}>{project.client}</p>
              <p {style}>{project.year}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    {#if activeProject && activeProject.project === project.project}
      <div
        class="expanded-info"
        in:slide={{ duration: 300, axis: "y", easing: cubicInOut }}
        out:slide={{ duration: 300, axis: "y", easing: cubicInOut }}
      >
        <div class="expanded-content">
          <div class="project-description">
            {#each currentProjectSections as section}
              {#if section.type === "text"}
                <div class="single text {project_data.media_type || ''}">
                  <TextContent text={section.value} {style} />
                </div>
              {:else if section.type === "diptych"}
                {#each section.value as item}
                  <div class="diptych-item">
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
    {/if}
  {/if}
</div>

<ProjectOverlay
  {hoveredProject}
  {activeProject}
  {clearSelection}
  {handleScroll}
  {closeButton}
  {fontStyle}
/>

<style>
  :global(body.overlay-active) {
    overflow: hidden;
  }

  :global(body:not(.overlay-active)) {
    overflow: auto;
  }

  .test {
    width: 100px;
    height: 100px;
    background-color: red;
  }
  .list.project .list-item {
    display: flex;
    flex-direction: row-reverse;
    width: 100%;
    justify-content: space-between;
    margin-bottom: 20px;
    gap: 20px;

    border-top: 1px solid lightgray;
    padding-top: 20px;
  }
  .list-item .tags {
    margin-bottom: 5px;
  }
  @media (min-width: 740px) {
    .list.project .list-item {
      /* border-top: none; */
      /* padding-top: 0; */
    }
  }
  .list.project img {
    width: 30%;
    height: auto;
  }
  @media (min-width: 740px) {
    .list.project img {
      width: 200px;
    }
  }
  .grid .list-view {
    display: none;
  }
  .list-view {
    flex-grow: 1;
  }

  .project-data-container {
    display: flex;
    flex-direction: column;
    gap: 5px;
    flex-grow: 1;
  }

  .project-data {
    z-index: 1;
    position: relative;
  }
  .list .project-data {
    display: flex;
    flex-direction: column;
  }
  .list-view .info {
    gap: 5px;
    display: flex;
    flex-direction: column;
  }

  @media (min-width: 740px) {
    .list .project-data {
      display: flex;
      gap: 20px;
      flex-direction: row-reverse;
    }
    .list-view .info {
      gap: 20px;
      flex-direction: row;
    }
    .list-view .info p {
      width: 100%;
    }
  }
  .grid.project {
    grid-column: var(--col-mobile);
    grid-row-start: var(--row-mobile);
    transition: opacity 0.3s ease;
  }

  .grid.project img {
    width: 100%;
  }
  .project {
    cursor: pointer;
  }
  .project img {
    border-radius: 5px;
  }

  @media (min-width: 740px) {
    .grid.project {
      grid-column: var(--col-desktop);
      grid-row-start: var(--row-desktop);
    }
  }

  /* tags */
  .tags {
    display: flex;
    gap: 5px;
    flex-shrink: 1;
    flex-wrap: wrap;
  }
  @media (min-width: 740px) {
  }
  .tag {
    font-size: 10px;
    border-radius: 3px;
    padding: 3px 5px;
    height: fit-content;
  }
  .expanded-info {
    width: 100%;
    border-top: 1px dashed lightgray;
    border-bottom: none;
    margin-bottom: 20px;
  }
  @media (min-width: 740px) {
    .expanded-info {
      /* border-bottom: 1px solid black; */
    }
  }
  .expanded-content {
    margin: 0 auto;
    margin-top: 20px;
  }
  .expanded-content .description {
    margin-bottom: 20px;
  }
  .project-link {
    display: inline-block;
    padding: 8px 16px;
    background-color: #000;
    color: #fff;
    text-decoration: none;
    border-radius: 4px;
    transition: background-color 0.3s ease;
  }
  .project-link:hover {
    background-color: #333;
  }
  .diptych-item:first-child {
    float: left;
  }
  .diptych-item {
    margin-bottom: 20px;
  }
  .single {
    margin-bottom: 20px;
  }
</style>
