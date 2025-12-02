import "../src/style.css";
import "../components/navbar.css";
import "../components/footer.css";
import { setupRevealAnimations } from "./smoothAnimations.js";

async function loadComponent(id, filePath) {
  try {
    const response = await fetch(filePath);
    const html = await response.text();
    document.getElementById(id).innerHTML = html;
  } catch (error) {
    console.error(`Error loading ${filePath}:`, error);
  }
}

// Load shared components using Vite-safe URLs
loadComponent("navbar", new URL("../components/navbar.html", import.meta.url));
loadComponent("footer", new URL("../components/footer.html", import.meta.url));

setupRevealAnimations();

window.addEventListener("load", () => {
  document.body.classList.add("loaded");
});
