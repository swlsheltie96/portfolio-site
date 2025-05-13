<script>
  import Papa from "papaparse";

  import { onMount } from "svelte";
  import { fontStyle } from "./stores.js";

  $: style = `font-size: ${$fontStyle.size}px;
              font-weight: ${$fontStyle.bold ? "bold" : "normal"};
              font-style: ${$fontStyle.italic ? "italic" : "normal"};
              text-decoration: ${$fontStyle.underline ? "underline" : "none"};`;

  let audioPlayer;
  let isPlaying = false;
  let currentTime = 0;
  let duration = 0;
  let currentSong = "";
  export let currentSongTitle;
  let music;

  function getRandomSong() {
    if (!music || music.length === 0) return "";
    const randomIndex = Math.floor(Math.random() * music.length);
    currentSongTitle = music[randomIndex].title;
    // console.log(currentSongTitle);
    return `/other_assets/music/${music[randomIndex].file}`;
  }

  function togglePlay() {
    if (isPlaying) {
      audioPlayer.pause();
    } else {
      audioPlayer.play();
    }
    isPlaying = !isPlaying;
  }

  function handleSeek() {
    audioPlayer.currentTime = currentTime;
  }

  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }

  onMount(async () => {
    const music_res = await fetch(
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vTZMTayJHqlx_4IXHlQ_TdvM6hA6P34Mo7t53ziC1lDYzewBezEmv7rcsZFvdXPLU6qebcTWn_Y8-FV/pub?gid=667589107&single=true&output=csv"
    );
    const music_text = await music_res.text();

    const music_parsed = Papa.parse(music_text, {
      header: true,
      skipEmptyLines: true,
    });

    music = music_parsed.data;
    // console.log(music);

    audioPlayer = document.getElementById("audio-player");
    currentSong = getRandomSong();
    // console.log(currentSong);
    audioPlayer.src = currentSong;

    audioPlayer.addEventListener("timeupdate", () => {
      currentTime = audioPlayer.currentTime;
    });

    audioPlayer.addEventListener("loadedmetadata", () => {
      duration = audioPlayer.duration;
    });

    audioPlayer.addEventListener("ended", () => {
      isPlaying = false;
      currentTime = 0;
      // Play next random song when current one ends
      currentSong = getRandomSong();
      audioPlayer.src = currentSong;
      audioPlayer.play();
      isPlaying = true;
    });
  });
</script>

<div class="music-inner">
  <audio id="audio-player"></audio>
  <div class="audio-controls">
    <button class="play-pause" on:click={togglePlay} {style}>
      {isPlaying ? "pause" : "play"}
    </button>
    <div class="timeline">
      <input
        type="range"
        bind:value={currentTime}
        max={duration}
        step="0.1"
        on:input={handleSeek}
      />
    </div>
    <div class="duration" {style}>
      {formatTime(currentTime)} / {formatTime(duration)}
    </div>
  </div>
</div>

<style>
  .music-inner {
    width: 100%;
  }

  .audio-controls {
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .play-pause {
    cursor: pointer;
  }

  .timeline {
    flex-grow: 1;
  }

  .timeline input[type="range"] {
    width: 100%;
    cursor: pointer;
    -webkit-appearance: none;
    background: transparent;
  }

  .timeline input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    height: 10px;
    width: 10px;
    border-radius: 50%;
    background: black;
    cursor: pointer;
    /* margin-top: 6px; */
  }

  .timeline input[type="range"]::-moz-range-thumb {
    -webkit-appearance: none;
    height: 10px;
    width: 10px;
    border-radius: 50%;
    background: black;
    cursor: pointer;
    /* margin-top: 6px; */
  }

  .timeline input[type="range"]::-webkit-slider-runnable-track {
    width: 100%;
    /* height: 20px; */
    /* background: black; */
    border-radius: 2px;
  }

  .timeline input[type="range"]::-moz-range-track {
    width: 100%;
    /* height: 20px; */
    /* background: black; */
    border-radius: 2px;
  }

  .duration {
  }
</style>
