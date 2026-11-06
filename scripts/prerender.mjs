import { readFile, writeFile } from "node:fs/promises";
import { render } from "../.prerender/entry-server.js";

const path = new URL("../dist/index.html", import.meta.url);
const template = await readFile(path, "utf8");
const marker = '<div id="root"></div>';
if (!template.includes(marker))
  throw new Error("Missing React root in built HTML");
const html = template.replace(marker, () => `<div id="root">${render()}</div>`);
await writeFile(path, html);
console.log(
  "Prerendered Good Rocket: HTML content is ready before JavaScript loads.",
);
