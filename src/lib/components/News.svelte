<script lang="ts">
  const COLLAPSED_COUNT = 4;

  let {
    news,
  }: {
    news: { date: string; body: string }[];
  } = $props();

  let expanded = $state(false);

  let visibleNews = $derived(expanded ? news : news.slice(0, COLLAPSED_COUNT));
</script>

<div class="news">
  <div class="component-title text-body"> News </div>
  <div class="text-body">
    {#each visibleNews as item}
      <div class="news-date"> {item.date}</div>
      <div class="news-item"> {item.body}</div>
    {/each}
  </div>
  {#if news.length > COLLAPSED_COUNT}
    <button class="text-body" onclick={() => (expanded = !expanded)}>
      {expanded ? "Show less" : "Show more"}
    </button>
  {/if}
</div>

<style>
.news-item {
  margin-bottom: var(--spacing);
}
</style>
