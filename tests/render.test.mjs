import { test } from "node:test";
import assert from "node:assert/strict";
import { loadContent } from "../lib/content.mjs";
import { renderPage, escapeHtml } from "../lib/render.mjs";

const opts = { assetBase: "assets/", canonical: "https://marcelamu9.github.io/", alternate: "https://marcelamu9.github.io/en/" };
const base = () => loadContent("es");
const withHero = (patch) => { const c = base(); Object.assign(c.hero, patch); return c; };
const withProject = (item) => { const c = base(); c.projects.items = [item]; return c; };
const withTools = (items) => { const c = base(); c.tools.items = items; return c; };

test("escapeHtml cubre & < > y comillas", () => {
  assert.equal(escapeHtml(`a & b < c > "d" 'e'`), "a &amp; b &lt; c &gt; &quot;d&quot; &#39;e&#39;");
});

test("escapa HTML en los textos", () => {
  const html = renderPage(withHero({ lead: 'precisión > 70 % & "churn"' }), opts);
  assert.match(html, /precisión &gt; 70 % &amp; &quot;churn&quot;/);
  assert.doesNotMatch(html, /precisión > 70/);
});

test("lang, hreflang y assetBase", () => {
  const html = renderPage(loadContent("en"), { assetBase: "../assets/", canonical: "https://marcelamu9.github.io/en/", alternate: "https://marcelamu9.github.io/" });
  assert.match(html, /<html lang="en"/);
  assert.match(html, /rel="alternate" hreflang="es" href="https:\/\/marcelamu9.github.io\/"/);
  assert.match(html, /rel="alternate" hreflang="x-default" href="https:\/\/marcelamu9.github.io\/"/);
  assert.match(html, /href="\.\.\/assets\/css\/site\.css"/);
  assert.match(html, /src="\.\.\/assets\/img\/marcela\.png"/);
  assert.match(html, /<a class="lang-link" href="\.\.\/" hreflang="es">ES<\/a>/);
});

test("proyecto sin image ni metrics no deja img ni chips vacíos", () => {
  const html = renderPage(withProject({ title: "X", tag: "t", text: "x", url: "https://e.x" }), opts);
  const card = html.slice(html.indexOf('<a class="pc"'), html.indexOf("</a>", html.indexOf('<a class="pc"')));
  assert.doesNotMatch(card, /src="assets\/img\/undefined"/);
  assert.doesNotMatch(card, /<figure/);
  assert.doesNotMatch(card, /<div class="chips">/);
});

test("proyecto con imagen svg va en figure.dark", () => {
  const html = renderPage(withProject({ title: "X", tag: "t", text: "x", url: "https://e.x", image: "d.svg", imageAlt: "d", metrics: [] }), opts);
  assert.match(html, /<figure class="dark"><img class="" src="assets\/img\/d\.svg" alt="d" loading="lazy">/);
});

test("herramienta con letter no produce img", () => {
  const html = renderPage(withTools([{ name: "R", letter: "R", letterColor: "#2066b8" }]), opts);
  assert.match(html, /<span class="r" style="color:#2066b8" aria-hidden="true">R<\/span>/);
  assert.doesNotMatch(html, /tool"><img/);
});

test("contenido real: 4 tarjetas, 4 nodos, 12 herramientas, un primario por vista", () => {
  const html = renderPage(loadContent("es"), opts);
  assert.equal((html.match(/class="pc"/g) || []).length, 4);
  assert.equal((html.match(/<li class="tl__item/g) || []).length, 4);
  assert.equal((html.match(/class="tool"/g) || []).length, 12);
  assert.match(html, /<li class="tl__item now"/);
  assert.equal((html.match(/mailto:Marcelamu9@gmail\.com/g) || []).length, 3);
  assert.match(html, /loading="lazy"/);
  assert.match(html, /fetchpriority="high"/);
  assert.match(html, /<title>Marcela Garzón: científica de datos y estadística<\/title>/);
  assert.match(html, /property="og:image" content="https:\/\/marcelamu9.github.io\/assets\/img\/marcela\.png"/);
  assert.match(html, /rel="icon" href="assets\/favicon\.svg"/);
  assert.match(html, /<script type="module" src="assets\/js\/site\.js">/);
});
