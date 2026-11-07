// Convierte el contenido (content/*.json) en el HTML de la página.
import { LINE_ICONS } from "./icons.mjs";

export function escapeHtml(s) {
  return String(s ?? "")
    .replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;").replaceAll("'", "&#39;");
}
const e = escapeHtml;

const ARROW = '<svg class="m-arrow" viewBox="0 0 12 12" aria-hidden="true"><path class="m-arrow__stem" d="M1 6h8"/><path class="m-arrow__head" d="M4.5 2.5 8 6l-3.5 3.5"/></svg>';

function svgLine(name) {
  const paths = LINE_ICONS[name];
  if (!paths) return "";
  return `<svg class="ic-line" viewBox="0 0 24 24" aria-hidden="true">${paths}</svg>`;
}

function primaryButton(label, href) {
  return `<a class="btn btn--primary" href="${e(href)}">${e(label)}${ARROW}</a>`;
}

function sectionHead(s) {
  return `<p class="eyebrow">${e(s.eyebrow)}</p><h2 class="h2-p" id="${e(s.id)}-h">${e(s.title)} <i>${e(s.titleAccent)}</i></h2>`;
}

function head(c, o) {
  const m = c.meta;
  const fonts = "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Chivo:wght@400;500&display=swap";
  const css = ["system.css", "motion.css", "icon.css", "site.css"].map((f) => `<link rel="stylesheet" href="${o.assetBase}css/${f}">`).join("\n");
  return `<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${e(m.title)}</title>
<meta name="description" content="${e(m.description)}">
<link rel="canonical" href="${e(o.canonical)}">
<link rel="alternate" hreflang="${e(m.otherLang)}" href="${e(o.alternate)}">
<link rel="alternate" hreflang="x-default" href="${e(m.lang === "es" ? o.canonical : o.alternate)}">
<meta property="og:type" content="website">
<meta property="og:title" content="${e(m.title)}">
<meta property="og:description" content="${e(m.description)}">
<meta property="og:image" content="${e(o.canonical.replace(/en\/$/, ""))}assets/img/marcela.png">
<meta property="og:locale" content="${m.lang === "es" ? "es_CO" : "en_US"}">
<link rel="icon" href="${o.assetBase}favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="${fonts}" rel="stylesheet">
${css}
</head>`;
}

function nav(c, o) {
  const links = c.nav.links.map((l) => `<div class="nav__item"><a class="nav__link" href="${e(l.href)}">${e(l.label)}</a></div>`).join("\n      ");
  return `<header class="nav">
  <div class="wrap nav__bar">
    <a class="nav__logo" href="#top">${e(c.nav.logo)}</a>
    <nav class="nav__links" aria-label="${c.meta.lang === "es" ? "Principal" : "Main"}">
      ${links}
    </nav>
    <div class="nav__actions">
      <a class="lang-link" href="${e(c.meta.otherLangHref)}" hreflang="${e(c.meta.otherLang)}">${e(c.meta.otherLangLabel)}</a>
      ${primaryButton(c.nav.cta, `mailto:${c.contact.email}`)}
    </div>
    <button class="nav__toggle" type="button" aria-expanded="false" aria-label="${c.meta.lang === "es" ? "Menú" : "Menu"}">
      <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M2 5h14M2 13h14" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
    </button>
  </div>
</header>`;
}

function hero(c, o) {
  const h = c.hero;
  const does = h.does.map((d) => `<li><span class="tile-ic">${svgLine(d.icon)}</span><div><h3>${e(d.title)}</h3><p>${e(d.text)}</p></div></li>`).join("\n          ");
  return `<section class="p hero-p" aria-labelledby="name">
    <div class="wrap">
      <div class="hero-g">
        <div>
          <p class="eyebrow">${e(h.eyebrow)}</p>
          <h1 class="name" id="name">${e(h.name)} <i>${e(h.surname)}</i></h1>
          <p class="hero-lead">${e(h.lead)}</p>
          <div class="actions">
            ${primaryButton(h.cta, `mailto:${c.contact.email}`)}
            <a class="btn btn--secondary" href="${e(h.secondary.href)}">${e(h.secondary.label)}</a>
          </div>
        </div>
        <figure class="portrait"><img src="${o.assetBase}img/marcela.png" alt="${e(h.photoAlt)}" fetchpriority="high"></figure>
        <ul class="does does-col">
          ${does}
        </ul>
      </div>
    </div>
  </section>`;
}

function about(c) {
  const a = c.about;
  const paragraphs = a.paragraphs.map((p) => `<p>${e(p)}</p>`).join("\n          ");
  const facts = a.facts.map((f) => `<li>${svgLine(f.icon)}<div>${e(f.text)}<span>${e(f.sub)}</span></div></li>`).join("\n          ");
  return `<section class="p" id="${e(a.id)}" aria-labelledby="${e(a.id)}-h">
    <div class="wrap">
      <div class="person">
        <div>${sectionHead(a)}</div>
        <div class="text">
          ${paragraphs}
        </div>
        <ul class="facts">
          ${facts}
        </ul>
      </div>
    </div>
  </section>`;
}

function experience(c) {
  const x = c.experience;
  const items = x.items.map((i) => `<li class="tl__item${i.current ? " now" : ""}">
          <span class="when">${e(i.when)}</span>
          <h3>${e(i.company)}</h3>
          <p class="role">${e(i.role)}</p>
          <p class="did">${e(i.text)}</p>
        </li>`).join("\n        ");
  return `<section class="p" id="${e(x.id)}" aria-labelledby="${e(x.id)}-h">
    <div class="wrap">
      <div class="head">
        <div>${sectionHead(x)}</div>
        <p class="lead">${e(x.lead)} <span class="muted">${e(x.leadMuted)}</span></p>
      </div>
      <ol class="tl">
        ${items}
      </ol>
    </div>
  </section>`;
}

function projectCard(p, c, o) {
  let figure = "";
  if (p.image) {
    const dark = /\.svg$/i.test(p.image);
    figure = `<figure${dark ? ' class="dark"' : ""}><img class="" src="${o.assetBase}img/${e(p.image)}" alt="${e(p.imageAlt)}" loading="lazy"></figure>`;
  }
  const metrics = Array.isArray(p.metrics) && p.metrics.length
    ? `<div class="chips">${p.metrics.map((m) => `<span>${e(m.label)} <b>${e(m.value)}</b></span>`).join("")}</div>`
    : "";
  return `<a class="pc" href="${e(p.url)}">
          ${figure}
          <div class="body">
            <span class="tag">${e(p.tag)}</span>
            <h3>${e(p.title)}</h3>
            <p>${e(p.text)}</p>
            ${metrics}
            <span class="go">${e(c.projects.linkLabel)}</span>
          </div>
        </a>`;
}

function projects(c, o) {
  const p = c.projects;
  return `<section class="p" id="${e(p.id)}" aria-labelledby="${e(p.id)}-h">
    <div class="wrap">
      <div class="head">
        <div>${sectionHead(p)}</div>
        <p class="lead">${e(p.lead)} <span class="muted">${e(p.leadMuted)}</span></p>
      </div>
      <div class="cards">
        ${p.items.map((i) => projectCard(i, c, o)).join("\n        ")}
      </div>
    </div>
  </section>`;
}

function tools(c, o) {
  const t = c.tools;
  const items = t.items.map((i) => {
    const mark = i.icon
      ? `<img class="ic ${e(i.iconClass || "")}" src="${o.assetBase}icons/${e(i.icon)}" alt="">`
      : `<span class="r" style="color:${e(i.letterColor || "")}" aria-hidden="true">${e(i.letter)}</span>`;
    return `<div class="tool">${mark}${e(i.name)}</div>`;
  }).join("\n        ");
  return `<section class="p" id="${e(t.id)}" aria-labelledby="${e(t.id)}-h">
    <div class="wrap">
      <div class="head">
        <div>${sectionHead(t)}</div>
        <p class="lead">${e(t.lead)}</p>
      </div>
      <div class="tools">
        ${items}
      </div>
    </div>
  </section>`;
}

function contact(c, o) {
  const k = c.contact;
  return `<footer class="p-foot" id="${e(k.id)}" aria-labelledby="invite">
  <div class="wrap">
    <div class="cta">
      <div>
        <p class="eyebrow">${e(k.eyebrow)}</p>
        <h2 class="invite" id="invite">${e(k.title)} <i>${e(k.titleAccent)}</i></h2>
      </div>
      <p>${e(k.text)}</p>
      <div class="cta-links">
        <a class="btn btn--primary" href="mailto:${e(k.email)}">${e(k.email)}${ARROW}</a>
        <div class="icons">
          <a href="${e(k.whatsapp)}" aria-label="WhatsApp"><img src="${o.assetBase}icons/whatsapp.svg" alt=""></a>
          <a href="${e(k.linkedin)}" aria-label="LinkedIn"><img src="${o.assetBase}icons/linkedin.svg" alt=""></a>
          <a href="${e(k.github)}" aria-label="GitHub"><img class="ic-ink" src="${o.assetBase}icons/github.svg" alt=""></a>
          <a class="cv" href="${o.assetBase}${e(k.cv)}">${e(k.cvLabel)}</a>
        </div>
      </div>
    </div>
    <div class="legal"><span>${e(c.footer.legal)}</span><span><a href="${e(c.meta.otherLangHref)}" hreflang="${e(c.meta.otherLang)}">${c.meta.lang === "es" ? "English" : "Español"}</a></span></div>
  </div>
</footer>`;
}

export function renderPage(content, opts) {
  const c = content, o = opts;
  return `<!doctype html>
<html lang="${e(c.meta.lang)}" data-type="software" data-radius="sharp" data-buttons="arrow" data-motion>
${head(c, o)}
<body>
${nav(c, o)}

<main id="top">
  ${hero(c, o)}

  ${about(c)}

  ${experience(c)}

  ${projects(c, o)}

  ${tools(c, o)}
</main>

${contact(c, o)}

<script type="module" src="${o.assetBase}js/motion.js"></script>
<script type="module" src="${o.assetBase}js/site.js"></script>
</body>
</html>
`;
}
