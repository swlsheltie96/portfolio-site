<script lang="ts">
  let {
    recognition,
  }: {
    recognition: { title: string; link?: string }[];
  } = $props();
</script>

<div class="recognition">
  <div class="component-title text-body">Recognition and Press</div>
  <div>
    {#each recognition as item}
      <div class="text-body">
        {#if item.link}
          <a href={item.link} target="_blank" rel="noopener noreferrer">{item.title}</a>
        {:else}
          {item.title}
        {/if}
      </div>
    {/each}
  </div>
</div>
