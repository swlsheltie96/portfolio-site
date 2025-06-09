<script>
  export let media;
  export let device = "mobile";
  export let type = "video";
  import { fontStyle } from "../stores.js";
  import { onMount, onDestroy } from "svelte";

  let videoElement;
  let isPlaying = true;
  let currentTime = 0;
  let duration = 0;
  let isDestroyed = false;
  let isLoading = true;
  let shouldLoad = false;
  let container;
  $: style = `font-size: ${$fontStyle.size}px;
              font-weight: ${$fontStyle.bold ? "bold" : "normal"};
              font-style: ${$fontStyle.italic ? "italic" : "normal"};
              text-decoration: ${$fontStyle.underline ? "underline" : "none"};`;

  onMount(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            shouldLoad = true;
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: "50px 0px", // Start loading when within 50px of viewport
        threshold: 0.1,
      }
    );

    if (container) {
      observer.observe(container);
    }

    return () => {
      if (container) {
        observer.unobserve(container);
      }
    };
  });

  // Cleanup function to handle component destruction
  onDestroy(() => {
    isDestroyed = true;
    isLoading = false;
    if (videoElement) {
      videoElement.pause();
      videoElement = null;
    }
  });

  function togglePlay() {
    if (!videoElement || isDestroyed) return;
    if (videoElement.paused) {
      videoElement.play();
      isPlaying = true;
    } else {
      videoElement.pause();
      isPlaying = false;
    }
  }

  function updateTime() {
    if (!videoElement || isDestroyed) return;
    currentTime = videoElement.currentTime;
    duration = videoElement.duration;
  }

  function seek(event) {
    if (!videoElement || isDestroyed) return;
    const seekTime = (event.offsetX / event.target.offsetWidth) * duration;
    videoElement.currentTime = seekTime;
  }

  function formatTime(seconds) {
    if (isNaN(seconds) || seconds === undefined) return "--:--";
    const minutes = Math.floor(seconds / 60);
    seconds = Math.floor(seconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }

  $: if (videoElement && !isDestroyed) {
    videoElement
      .play()
      .then(() => {
        if (!isDestroyed) isPlaying = true;
      })
      .catch(() => {
        if (!isDestroyed) isPlaying = false;
      });
  }

  function handleVideoLoad() {
    if (!videoElement || isDestroyed) return;
    isLoading = false;
    isPlaying = !videoElement.paused;
  }

  // console.log(media);
  if (media.type) {
    if (media.type == "image") {
      type = "image";
      console.log(media);
      media = media.media;
    }
  }

  // Reactive statement to properly handle media prop
  $: mediaUrl = (() => {
    if (!media) return "";

    // If media is an object with type and media properties
    if (typeof media === "object" && media !== null) {
      if (media.type === "image") {
        type = "image";
        return media.media || "";
      }
      // If it's an object but doesn't have the expected structure, try to use it directly
      return media.toString();
    }

    // If media is already a string
    if (typeof media === "string") {
      return media;
    }

    // Fallback
    return "";
  })();

  $: fullUrl = mediaUrl ? `https://pub-de90c051aa034ae4942bc22f6c3686f0.r2.dev/${mediaUrl}` : "";
</script>

{#if type === "video"}
  <div class="item-content media {device}" bind:this={container}>
    <div class="video-container">
      {#if shouldLoad}
        <video
          bind:this={videoElement}
          src={fullUrl}
          autoplay
          muted
          loop
          playsinline
          preload="auto"
          style="width: 100%; height: auto;"
          on:timeupdate={updateTime}
          on:loadedmetadata={updateTime}
          on:loadeddata={handleVideoLoad}
        ></video>
      {:else}
        <div
          class="video-placeholder"
          style="width: 100%; aspect-ratio: 16/9; background: #f0f0f0; border-radius: 5px;"
        ></div>
      {/if}
      <div class="video-controls">
        <button class="play-pause" on:click={togglePlay} {style} disabled={!shouldLoad}>
          {isPlaying ? "pause" : "play"}
        </button>
        <div class="timeline" on:click={seek}>
          <div
            class="progress"
            class:loading={isLoading}
            style="width: {isLoading ? '100%' : (currentTime / duration) * 100}%"
          ></div>
        </div>
        <div class="time-display" {style}>
          {#if !shouldLoad}
            Not loaded
          {:else if isLoading}
            Loading...
          {:else}
            {formatTime(currentTime)} / {formatTime(duration)}
          {/if}
        </div>
      </div>
    </div>
  </div>
{:else if type === "image"}
  <div class="item-content media {device}">
    <img src={fullUrl} alt="" style="width: 100%; height: auto;" />
  </div>
{/if}

<style>
  .media {
    width: 100%;
    max-width: 400px;
    margin-left: auto;
  }
  .desktop {
    max-width: 100%;
  }
  .desktop video {
    border: solid 1px rgb(0 0 0 / 10%);
    box-sizing: border-box;
  }
  video,
  img {
    border-radius: 5px;
    overflow: hidden;
  }

  .video-container {
    position: relative;
    width: 100%;
  }

  .video-controls {
    background: white;
    padding: 10px;
    display: flex;
    align-items: center;
    gap: 10px;
    opacity: 1;
    transition: opacity 0.3s;
    border-radius: 5px;
    border: solid 1px black;
    margin-top: 5px;
  }

  .play-pause {
    cursor: pointer;
  }

  .timeline {
    flex-grow: 1;
    height: 4px;
    background: rgba(0, 0, 0, 0.3);
    cursor: pointer;
    border-radius: 2px;
    position: relative;
  }

  .progress {
    position: absolute;
    height: 100%;
    background: black;
    border-radius: 2px;
    transition: width 0.1s linear;
  }

  .progress.loading {
    background: linear-gradient(90deg, black 0%, #666 50%, black 100%);
    background-size: 200% 100%;
    animation: loading 1.5s infinite linear;
  }

  @keyframes loading {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }

  .video-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #666;
    font-size: 14px;
  }

  .play-pause:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>
