import "../components/in-progress.css";

export async function loadInProgress(targetSelector) {
  const target = document.querySelector(targetSelector);
  if (!target) return;

  const res = await fetch("/components/in-progress.html");
  const html = await res.text();
  target.innerHTML = html;
}
