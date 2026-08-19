<script lang="ts">
	let { items }: { items?: string[] | null } = $props();
	let list = $derived(items ?? []);
</script>

{#if list.length > 0}
	<div class="clients-and-collaborators text-body">
		<div class="component-title text-body">Clients and Collaborators</div>

		<div class="clients-list">
			{#each list as item (item)}
				<div class="client text-body">{item}</div>
			{/each}
		</div>
	</div>
{/if}

<style>
	.clients-list {
		display: block;
		/* flex-wrap: wrap;
		gap: var(--spacing); */
	}
</style>
