<script lang="ts">
  let { text }: { text: string } = $props();

  let headerEl: HTMLElement | undefined = $state();

  $effect(() => {
    if (!headerEl) return;

    const setHeaderHeight = () => {
      document.documentElement.style.setProperty(
        "--header-height",
        `${headerEl!.offsetHeight}px`,
      );
    };

    setHeaderHeight();

    const observer = new ResizeObserver(setHeaderHeight);
    observer.observe(headerEl);

    return () => observer.disconnect();
  });
</script>

<header bind:this={headerEl} class="header text-body">
  <div class="header-text">
    {text}
  </div>
</header>

<style>
  .header-text {
    /* padding-bottom: var(--spacing); */
    margin-top: var(--spacing-sm);
  }
</style>
