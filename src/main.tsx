import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { App } from "./App";
import "./fonts.css";
import "./studio.css";

if ("scrollRestoration" in history) history.scrollRestoration = "manual";
if (location.hash) {
  history.replaceState(null, "", location.pathname + location.search);
}
window.scrollTo({ top: 0, left: 0, behavior: "instant" });
window.addEventListener("pageshow", () => {
  window.scrollTo({ top: 0, left: 0, behavior: "instant" });
});

const root = document.getElementById("root");

if (!root) throw new Error("Root element not found");

const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

if (root.hasChildNodes()) hydrateRoot(root, app);
else createRoot(root).render(app);
