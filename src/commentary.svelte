<script>
  import { fade } from "svelte/transition";

  import Papa from "papaparse";
  import { onMount, onDestroy } from "svelte";
  import { fontStyle, tags, view } from "./stores.js";

  import { tick } from "svelte";
  $: style = `font-size: ${$fontStyle.size}px;
              font-weight: ${$fontStyle.bold ? "bold" : "normal"};
              font-style: ${$fontStyle.italic ? "italic" : "normal"};
              text-decoration: ${$fontStyle.underline ? "underline" : "none"};`;
  let captions = [];
  onMount(async () => {
    const text_res = await fetch(
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vTZMTayJHqlx_4IXHlQ_TdvM6hA6P34Mo7t53ziC1lDYzewBezEmv7rcsZFvdXPLU6qebcTWn_Y8-FV/pub?gid=1753946897&single=true&output=csv"
    );
    const text_text = await text_res.text();

    const text_parsed = Papa.parse(text_text, {
      header: true,
      skipEmptyLines: true,
    });

    captions = text_parsed.data;
    // console.log("captions loaded:", captions);

    if (captions.length > 0) {
      cycleLines();
    }
  });

  // export let lines = [];
  export let delayBetween = 2000;

  let currentLine = "";
  let currentIndex = 0;
  let visible = true;

  async function typeLine(line) {
    currentLine = "";
    // console.log(line);
    for (let i = 0; i < line.length; i++) {
      currentLine += line[i];
      await tick();
      await new Promise((r) => setTimeout(r, 30)); // typing speed
    }
  }

  async function cycleLines() {
    while (currentIndex < captions.length) {
      // console.log(captions);
      visible = true;
      await typeLine(captions[currentIndex].line); // <- assumes each object has `.line`
      await new Promise((r) => setTimeout(r, delayBetween));
      visible = false;
      await tick();
      await new Promise((r) => setTimeout(r, 500)); // fade out duration
      currentIndex++;
    }
  }
</script>

{#if visible}
  <p class="commentary" in:fade={{ duration: 200 }} out:fade={{ duration: 500 }} {style}>
    {currentLine}
  </p>
{/if}

<style>
  p {
    margin-top: 20px;
    margin-left: 20px;
    max-width: calc(100% - 40px);
  }
</style>
