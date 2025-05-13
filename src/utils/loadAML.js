import archieml from "archieml";

export async function fetchArchieml(url) {
  const res = await fetch(url);
  const html = await res.text();

  const div = document.createElement("div");
  div.innerHTML = html;
  const paragraphs = Array.from(div.querySelectorAll("p"));

  const text = paragraphs.map((p) => p.textContent).join("\n");
  const parsed = archieml.load(text);
  return parsed;
}
