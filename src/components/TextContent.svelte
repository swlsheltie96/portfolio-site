<script>
  export let text;
  export let style;
</script>

<div class="item-content text">
  <p {style}>{@html text}</p>
</div>

<style>
  .text {
    width: 100%;
    max-width: 400px;
  }
</style>
