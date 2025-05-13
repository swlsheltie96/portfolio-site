// src/fontStore.js
import { writable } from "svelte/store";

export const fontStyle = writable({
  size: 12,
  bold: false,
  italic: false,
  underline: false,
});

export const tags = writable({
  editorial: { label: "editorial", color: "lightgreen" },
  illustration: { label: "illustration", color: "tomato" },
  art_direction: { label: "art direction", color: "cyan" },
  web_design: { label: "web design", color: "plum" },
});

export const view = writable("grid");

export const projects_data = writable([]);
export const collapseAll = writable(false);
export const showTags = writable(false);
export const selectedTag = writable(null);
