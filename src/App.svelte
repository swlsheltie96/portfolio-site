<script>
  import { view } from "./stores.js";

  import Info from "./info.svelte";
  import Projects from "./projects.svelte";
  import Commentary from "./commentary.svelte";

  $: cur_view = $view;
</script>

<Info />

{#if cur_view == "list"}
  <Commentary />
{/if}
<Projects />

<style>
</style>
