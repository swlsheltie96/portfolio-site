<script lang="ts">
	let { text }: { text: string } = $props();
</script>

<div class="about text-body">
	<div class="component-title text-body">About</div>

	<div class="about-text">
		{text}
	</div>
</div>

<style>
	.about-text {
		/* padding-bottom: var(--spacing); */
	}
</style>
