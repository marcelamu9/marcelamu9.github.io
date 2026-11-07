// Menú móvil: abre y cierra la cabecera (system.css dibuja la hoja con header.nav.is-open).
const nav = document.querySelector("header.nav");
const toggle = nav?.querySelector(".nav__toggle");

function setOpen(open) {
  nav.classList.toggle("is-open", open);
  toggle.setAttribute("aria-expanded", String(open));
}

if (nav && toggle) {
  toggle.addEventListener("click", () => setOpen(!nav.classList.contains("is-open")));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && nav.classList.contains("is-open")) { setOpen(false); toggle.focus(); } });
  nav.addEventListener("click", (e) => { if (nav.classList.contains("is-open") && e.target.closest("a[href]")) setOpen(false); });
}
