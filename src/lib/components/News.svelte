<script lang="ts">
  let {
    news,
  }: {
    news: { date: string; body: string }[];
  } = $props();
</script>

<div class="news">
  <div class="component-title text-body"> News </div>
  <div class="text-body">
    {#each news as item}
      <div class="news-date"> {item.date}</div>
      <div class="news-item"> {item.body}</div>
    {/each}
  </div>
</div>

<style>
.news-item {
  margin-bottom: var(--spacing);
}
</style>