# Portafolio marcelamu9.github.io — plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir y publicar el sitio personal de una página de Marcela Garzón en `https://marcelamu9.github.io` (ES) y `/en/` (EN), generado desde `content/es.json` y `content/en.json`, con el diseño de la maqueta E.

**Architecture:** Un generador estático propio en Node sin dependencias: `lib/render.mjs` convierte un objeto de contenido en el HTML de la página; `build.mjs` lee los dos JSON, escribe `dist/index.html` y `dist/en/index.html` y copia `assets/`. El CSS es el de la maqueta E (`site.css`) sobre la base del kit (`system.css`, `motion.css`, `icon.css`). GitHub Actions construye en cada push a `main` y publica `dist/` en la rama `gh-pages`, de donde Pages ya sirve.

**Tech Stack:** Node 24 (ESM, `node:test`, `node:fs`), HTML/CSS estático, GitHub Actions (`actions/checkout@v4`, `actions/setup-node@v4`, `peaceiris/actions-gh-pages@v4`). Sin npm install.

**Spec:** `docs/superpowers/specs/2026-11-06-portfolio-design.md`. **Maqueta de referencia (HTML y CSS a portar):** `.superpowers/mockups/e.html`. **Kit:** `.superpowers/mockups/assets/` (copia ya hecha de `system.css`, `motion/`, `icons/`, imágenes, iconos SVG, CV).

## Global Constraints

- Repo: la carpeta `C:\Users\marcela\Documents\portfolio\portfolio` es el repo; rama `main`; remoto `https://github.com/marcelamu9/marcelamu9.github.io.git`. Nunca versionar `dist/`, `.superpowers/`, `.agents/`, `.taste-skill/`, `portfolio/`, `node_modules/`.
- Mensajes de commit terminan con la línea `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>`.
- Colores exactos: fondo `#0f0a0e`, superficie `#171015`, texto `#f6f1f4`, secundario `#a89ea4`, acento `#ff4d8d`, líneas `rgba(246,241,244,.13)`. Sin degradados, brillos ni sombras.
- Tipografía: Instrument Serif (400, normal e itálica) + Chivo (400, 500) desde Google Fonts con `display=swap`. `data-radius="sharp"`, `data-buttons="arrow"`.
- Contenido: solo lo que está en `e.html` (versión 1 de los textos) y en el CV. El generador no inventa ni completa texto: una clave vacía se renderiza vacía. Prohibido: franja de cifras, SENA, Magneto, hobbies, "impacto"/"resultado de negocio"/"clientes" en tarjetas de proyecto.
- Una sola acción primaria visible por vista: `Escríbeme` → `mailto:Marcelamu9@gmail.com`. WhatsApp `https://wa.me/573147698713`, LinkedIn `https://www.linkedin.com/in/marcelagarzondatascience/`, GitHub `https://github.com/marcelamu9`, CV `assets/cv-marcela-garzon.pdf`.
- Iconos solo locales (`assets/icons/*.svg`), nunca CDN. R y SQL en tipografía (`letter`), sin logo de Postgres.
- Imágenes de proyecto con `loading="lazy"`; foto del hero con `fetchpriority="high"`.
- `<html lang>` por idioma, `<link rel="alternate" hreflang>` cruzado, `<title>` y `<meta name="description">` por idioma, Open Graph con la foto, favicon SVG.
- Rutas de enlaces entre idiomas: desde `/` el inglés es `en/`; desde `/en/` el español es `../`. Los assets se referencian con prefijo `assets/` en ES y `../assets/` en EN (el render recibe `assetBase`).
- `prefers-reduced-motion: reduce` desactiva transiciones (ya lo hace `motion.css`; `site.css` no añade animaciones propias).

## Review Focus

1. Texto del JSON con `<`, `&` o comillas (p. ej. `"precisión > 70 %"`, `"OLS & ARIMA"`) → debe aparecer escapado, nunca romper el HTML. Test en Task 3.
2. Un proyecto sin `image` o sin `metrics` (p. ej. el de costos cuando aún no hay gráfica) → la tarjeta se renderiza sin `<img>` roto y sin fila de fichas vacía. Test en Task 3.
3. `en.json` con una clave de menos o de más respecto a `es.json` → el build falla con un mensaje que nombra la ruta de la clave (`projects.items[2].metrics`), no publica una página a medias. Test en Task 2 y Task 5.
4. Una herramienta con `letter` y sin `icon` (R, SQL) → se renderiza la letra en serif, sin `<img src="undefined">`. Test en Task 3.
5. Título de proyecto o nombre de empresa largo a 390 px → sin scroll horizontal ni texto cortado. Verificación en Task 8 (captura a 390 y lectura de `scrollWidth`).

---

### Task 1: Repo y assets

**Files:**
- Create: `.gitignore`, `package.json`, `assets/css/system.css`, `assets/css/motion.css`, `assets/css/icon.css`, `assets/js/motion.js`, `assets/icons/*.svg`, `assets/img/marcela.png`, `assets/img/olist_stepfunctions.png`, `assets/img/desafio_item1.png`, `assets/img/churn_metrics.png`, `assets/cv-marcela-garzon.pdf`
- Keep: `docs/` (specs y planes se versionan)

**Interfaces:**
- Produces: la estructura `assets/{css,js,icons,img}` que `build.mjs` copia entera a `dist/assets/`; `package.json` con `"type": "module"`, `"scripts": { "build": "node build.mjs", "test": "node --test tests/" }`, sin `dependencies`.

- [ ] **Step 1: Inicializar el repo en `C:\Users\marcela\Documents\portfolio\portfolio`**

Run: `git init -b main && git remote add origin https://github.com/marcelamu9/marcelamu9.github.io.git`
Expected: `Initialized empty Git repository` y `git remote -v` muestra `origin`.

- [ ] **Step 2: Escribir `.gitignore`**

Contenido exacto, una línea cada uno: `dist/`, `node_modules/`, `.superpowers/`, `.agents/`, `.taste-skill/`, `portfolio/`, `skills-lock.json`, `shots/`, `.DS_Store`, `Thumbs.db`.

- [ ] **Step 3: Escribir `package.json`** con `name: "marcelamu9.github.io"`, `private: true`, `type: "module"`, `engines.node: ">=20"`, y los scripts de Interfaces. Sin dependencias.

- [ ] **Step 4: Copiar los assets desde la maqueta**

Run (bash):
```bash
M=.superpowers/mockups/assets; mkdir -p assets/css assets/js assets/icons assets/img
cp $M/system.css assets/css/system.css; cp $M/motion/motion.css assets/css/motion.css; cp $M/icons/icon.css assets/css/icon.css
cp $M/motion/motion.js assets/js/motion.js
cp $M/icons/*.svg assets/icons/; cp $M/icons/icons-credits.json assets/icons/
cp $M/img/marcela.png $M/img/olist_stepfunctions.png $M/img/desafio_item1.png $M/img/churn_metrics.png assets/img/
cp "$M/cv-marcela-garzon.pdf" assets/cv-marcela-garzon.pdf
```
Expected: `ls assets/icons | wc -l` ≥ 18; `ls assets/img` lista las 4 imágenes.

- [ ] **Step 5: Revisar que `motion.js` no dependa de `system.js`**

Run: `grep -n "import\|system" assets/js/motion.js | head`
Expected: sin `import` de `system.js`. Si lo hubiera, copiar también `system.js` a `assets/js/` y anotarlo en Task 3 (Step 7, scripts).

- [ ] **Step 6: Commit**

```bash
git add .gitignore package.json assets docs
git commit -m "chore: repo del sitio con assets del kit, imágenes, iconos y CV"
```

---

### Task 2: Contenido en JSON (ES y EN) con validación de estructura

**Files:**
- Create: `content/es.json`, `content/en.json`, `lib/content.mjs`
- Test: `tests/content.test.mjs`

**Interfaces:**
- Produces: `loadContent(lang: "es"|"en", dir = "content"): object` que lee y parsea el JSON; `assertSameShape(a: object, b: object, path = ""): void` que lanza `Error("Clave distinta en <path>")` si las claves (recursivas, arrays por longitud e índice) difieren; `REQUIRED = ["meta.title","meta.description","hero.name","hero.surname","hero.lead","contact.email"]` y `assertRequired(content, lang): void` que lanza `Error("Falta <path> en <lang>.json")`.
- Estructura exacta del JSON (igual en ambos idiomas):

```json
{
  "meta": { "title": "", "description": "", "lang": "es", "otherLang": "en", "otherLangHref": "en/", "otherLangLabel": "EN" },
  "nav": { "logo": "Marcela Garzón", "links": [ { "href": "#persona", "label": "" } ], "cta": "Escríbeme" },
  "hero": { "eyebrow": "", "name": "Marcela", "surname": "Garzón", "lead": "", "cta": "Escríbeme", "secondary": { "href": "#proyectos", "label": "Ver proyectos" }, "photoAlt": "Marcela Garzón",
            "does": [ { "icon": "trending-up", "title": "", "text": "" } ] },
  "about": { "id": "persona", "eyebrow": "Sobre mí", "title": "La persona detrás de los", "titleAccent": "modelos", "paragraphs": [ "" ],
             "facts": [ { "icon": "graduation-cap", "text": "", "sub": "" } ] },
  "experience": { "id": "recorrido", "eyebrow": "Experiencia", "title": "Mi recorrido en", "titleAccent": "datos", "lead": "", "leadMuted": "",
                  "items": [ { "when": "", "company": "", "role": "", "text": "", "current": true } ] },
  "projects": { "id": "proyectos", "eyebrow": "Proyectos", "title": "Lo que construyo para seguir", "titleAccent": "aprendiendo", "lead": "", "leadMuted": "", "linkLabel": "Ver en GitHub",
                "items": [ { "title": "", "tag": "", "text": "", "metrics": [ { "label": "", "value": "" } ], "image": "olist_stepfunctions.png", "imageAlt": "", "url": "" } ] },
  "tools": { "id": "herramientas", "eyebrow": "Herramientas", "title": "Con lo que", "titleAccent": "trabajo", "lead": "",
             "items": [ { "name": "Python", "icon": "python.svg", "iconClass": "" }, { "name": "R", "letter": "R", "letterColor": "#2066b8" } ] },
  "contact": { "id": "contact", "eyebrow": "Contacto", "title": "¿Tienes un reto de datos?", "titleAccent": "Hablemos.", "text": "",
               "email": "Marcelamu9@gmail.com", "whatsapp": "https://wa.me/573147698713", "linkedin": "", "github": "", "cv": "cv-marcela-garzon.pdf", "cvLabel": "CV" },
  "footer": { "legal": "© 2026 Marcela Garzón · Colombia" }
}
```

- [ ] **Step 1: Escribir el test de estructura y de carga**

`tests/content.test.mjs`, con `node:test` y `node:assert/strict`:
```js
test("es.json y en.json tienen la misma estructura", () => { assertSameShape(loadContent("es"), loadContent("en")); });
test("ambos tienen las claves obligatorias", () => { for (const l of ["es","en"]) assertRequired(loadContent(l), l); });
test("assertSameShape nombra la ruta de la clave distinta", () => {
  assert.throws(() => assertSameShape({ a: { b: 1 } }, { a: { c: 1 } }), /Clave distinta en a/);
  assert.throws(() => assertSameShape({ p: [1, 2] }, { p: [1] }), /Clave distinta en p/);
});
test("los proyectos son 4 y la experiencia va de la más reciente a la más antigua", () => {
  const es = loadContent("es");
  assert.equal(es.projects.items.length, 4);
  assert.equal(es.experience.items[0].company, "Fluid Attacks");
  assert.equal(es.experience.items.at(-1).company, "Grupo BIT");
  assert.equal(es.experience.items.filter(i => i.current).length, 1);
});
test("ninguna tarjeta de proyecto usa palabras de impacto", () => {
  for (const p of loadContent("es").projects.items) assert.doesNotMatch(p.text + p.title, /impacto|resultado de negocio|clientes reales/i);
});
```

- [ ] **Step 2: Ejecutar y ver que falla**

Run: `node --test tests/`
Expected: FAIL, `Cannot find module 'lib/content.mjs'`.

- [ ] **Step 3: Implementar `lib/content.mjs`** con `loadContent`, `assertSameShape`, `assertRequired`, `REQUIRED` según Interfaces. `assertSameShape` compara `Object.keys` ordenadas en objetos y `length` en arrays, recursivo, con la ruta acumulada (`a.b[2].c`).

- [ ] **Step 4: Escribir `content/es.json`** copiando **palabra por palabra** los textos de `.superpowers/mockups/e.html` (portada, tres capacidades, "Sobre mí" con sus 3 facts, los 4 nodos de experiencia en orden Fluid Attacks → CODESA → Matrix Kassier Sured → Grupo BIT, la entrada y las 4 tarjetas de proyectos con sus fichas, la frase y las 12 herramientas, el cierre). `tools.items` en este orden: Python (icon `python.svg`), R (letter `R`, `#2066b8`), SQL (letter `SQL`, color `#f6f1f4`), scikit-learn (`scikitlearn.svg`, iconClass `ic-land`), Snowflake, dbt, PySpark (`apache-spark.svg`, `ic-land`), AWS (`aws.svg`, `ic-land`), Power BI (`power-bi.svg`, `ic-tall`), QuickSight (`aws-quicksight.svg`), Jupyter, Git. El proyecto de costos lleva `"image": "costos_diagrama.svg"` (se crea en Task 4) y `metrics` `[{"label":"Modelos","value":"OLS + ARIMA"},{"label":"Intervalos","value":"Monte Carlo"}]`. URLs de los repos con los **nombres nuevos**: `price-anomalies-ml-vs-llm`, `customer-churn-xgboost`, `equipment-cost-forecasting`, `aws-olist-data-pipeline`.

- [ ] **Step 5: Escribir `content/en.json`** con la misma estructura y una traducción conservadora y clara. Fijos: `meta.lang "en"`, `otherLang "es"`, `otherLangHref "../"`, `otherLangLabel "ES"`; nav `About · Path · Projects · Tools`; cta `Email me`; secondary `View projects`; títulos `The person behind the / models`, `My path in / data`, `What I build to keep / learning`, `What I work / with`, contacto `Have a data challenge? / Let's talk.`; `linkLabel "View on GitHub"`; `cvLabel "CV"`; legal `© 2026 Marcela Garzón · Colombia`. Números con punto decimal en inglés (`0.78`, `44.5 %`, `80,294`).

- [ ] **Step 6: Ejecutar los tests**

Run: `node --test tests/`
Expected: 5 PASS.

- [ ] **Step 7: Commit**

```bash
git add content lib/content.mjs tests/content.test.mjs
git commit -m "feat: contenido ES/EN en JSON con validación de estructura"
```

---

### Task 3: Render de la página

**Files:**
- Create: `lib/render.mjs`, `lib/icons.mjs`
- Test: `tests/render.test.mjs`

**Interfaces:**
- Consumes: el objeto de `loadContent` (Task 2).
- Produces: `renderPage(content: object, opts: { assetBase: string, canonical: string, alternate: string }): string` (HTML completo, `<!doctype html>` incluido); `escapeHtml(s: string): string`; `lib/icons.mjs` exporta `LINE_ICONS: Record<string, string>` con el SVG inline (sin `<svg>` exterior: solo los `path`/`circle`/`rect`/`ellipse`) de `trending-up`, `users`, `database`, `graduation-cap`, `briefcase`, tomados de `.superpowers/mockups/e.html`.
- El HTML producido reproduce la estructura y clases de `e.html` (header `.nav`, `main > section.p` con ids `persona`, `recorrido`, `proyectos`, `herramientas`, `footer.p-foot#contact`), con estas diferencias: el conmutador de idioma es `<a class="lang-link" href="{otherLangHref}" hreflang="{otherLang}">{otherLangLabel}</a>`; el icono de GitHub en el cierre lleva clase `ic-ink` y no `style`; los scripts son `assets/js/motion.js` y `assets/js/site.js`.
- `<head>`: `<title>`, `description`, `canonical`, `alternate hreflang` (el otro idioma y `x-default` = ES), `og:title`, `og:description`, `og:image` (`{canonical}assets/img/marcela.png` absoluto), `og:locale`, `<link rel="icon" href="{assetBase}favicon.svg" type="image/svg+xml">`, las fuentes, y los CSS en orden `system.css`, `motion.css`, `icon.css`, `site.css`.

- [ ] **Step 1: Escribir los tests**

`tests/render.test.mjs` con un `content` mínimo construido en el test (no el JSON real) más un test sobre `loadContent("es")`:
```js
test("escapa HTML en los textos", () => {
  const html = renderPage(withHero({ lead: 'precisión > 70 % & "churn"' }), opts);
  assert.match(html, /precisión &gt; 70 % &amp; &quot;churn&quot;/);
  assert.doesNotMatch(html, /precisión > 70/);
});
test("lang, hreflang y assetBase", () => {
  const html = renderPage(loadContent("en"), { assetBase: "../assets/", canonical: "https://marcelamu9.github.io/en/", alternate: "https://marcelamu9.github.io/" });
  assert.match(html, /<html lang="en"/);
  assert.match(html, /rel="alternate" hreflang="es" href="https:\/\/marcelamu9.github.io\/"/);
  assert.match(html, /href="\.\.\/assets\/css\/site\.css"/);
  assert.match(html, /src="\.\.\/assets\/img\/marcela\.png"/);
});
test("proyecto sin image ni metrics no deja img ni chips vacíos", () => {
  const html = renderPage(withProject({ title: "X", tag: "t", text: "x", url: "https://e.x" }), opts);
  assert.doesNotMatch(html, /src="assets\/img\/undefined"/);
  assert.doesNotMatch(html, /<div class="chips"><\/div>/);
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
  assert.equal((html.match(/mailto:Marcelamu9@gmail\.com/g) || []).length, 3); // nav, hero, cierre
  assert.match(html, /loading="lazy"/);
  assert.match(html, /fetchpriority="high"/);
});
```
`opts = { assetBase: "assets/", canonical: "https://marcelamu9.github.io/", alternate: "https://marcelamu9.github.io/en/" }`. `withHero/withProject/withTools` parten de `loadContent("es")` y sustituyen el campo.

- [ ] **Step 2: Ejecutar y ver que falla**

Run: `node --test tests/render.test.mjs`
Expected: FAIL, `Cannot find module 'lib/render.mjs'`.

- [ ] **Step 3: Implementar `lib/icons.mjs`** (`LINE_ICONS`) copiando los trazos de los cinco iconos de `e.html`.

- [ ] **Step 4: Implementar `lib/render.mjs`**: `escapeHtml` (`& < > " '`), un helper `svgLine(name)` que envuelve `LINE_ICONS[name]` en `<svg class="ic-line" viewBox="0 0 24 24" aria-hidden="true">`, y funciones `head`, `nav`, `hero`, `about`, `experience`, `projects`, `tools`, `contact` que devuelven strings; `renderPage` las concatena. Cada nodo de experiencia es `<li class="tl__item{ current ? " now" : "" }">`. Las tarjetas: `<a class="pc" href>` con `<figure>` solo si hay `image` (`.svg` → `<figure class="dark">`), `<div class="chips">` solo si `metrics.length > 0`. Herramientas: `icon` → `<img class="ic {iconClass}" src="{assetBase}icons/{icon}" alt="">`; `letter` → el `<span class="r">` del test. Todo texto pasa por `escapeHtml`.

- [ ] **Step 5: Ejecutar los tests**

Run: `node --test tests/`
Expected: todos PASS (los 5 de Task 2 y los 5 de esta).

- [ ] **Step 6: Commit**

```bash
git add lib/render.mjs lib/icons.mjs tests/render.test.mjs
git commit -m "feat: render de la página desde el contenido"
```

---

### Task 4: CSS del sitio, script del menú, diagrama y favicon

**Files:**
- Create: `assets/css/site.css`, `assets/js/site.js`, `assets/img/costos_diagrama.svg`, `assets/favicon.svg`

**Interfaces:**
- Consumes: las clases que emite `renderPage` (Task 3), idénticas a las de `e.html` salvo `.lang-link` y `.tl__item`.
- Produces: `site.css` = el bloque `<style>` de `e.html` desde `:root` hasta el último `@media`, con estos cambios: eliminar las reglas de `.strip`; renombrar `.tl li` → `.tl .tl__item` (y `.tl li.now` → `.tl__item.now`, `.tl li::before` → `.tl__item::before`); añadir `.lang-link { font-size: 13px; font-weight: 500; color: var(--muted); text-decoration: none; padding: 5px 10px; border: 1px solid var(--hair); border-radius: 999px; }` y `.lang-link:hover { color: var(--ink); border-color: var(--ink); }`; `.pc figure.dark img { object-fit: contain; padding: var(--s-4); }`; `.tool .r { color: var(--ink); }` como valor base (el color por herramienta va inline); `.icons .ic-ink { filter: invert(1); }` (el logo de GitHub es negro y la página es oscura; `icon.css` solo lo invierte dentro de `.ground-inverse`). El `:root` con `--p-*` se mantiene tal cual para que `system.css` derive los tokens.
- `site.js` (sin módulos externos, `type="module"`): toma `header.nav` y `.nav__toggle`; al clic alterna `is-open` en el header y `aria-expanded`; `Escape` cierra; un clic en cualquier `a[href]` dentro del nav cierra. Nada más.
- `costos_diagrama.svg`: 1200×600, fondo transparente, cinco nodos en fila unidos por una línea (`stroke: #a89ea4`, 1px), cada nodo un círculo de 28px de radio con borde `#ff4d8d` y el texto en Chivo 22px `#f6f1f4` debajo: `Materias primas`, `Selección de variables`, `OLS y ARIMA`, `Monte Carlo`, `Agente`; subtítulos 16px `#a89ea4`: `series mensuales`, ` `, `pronóstico`, `intervalos`, `responde`. `font-family="Chivo, system-ui, sans-serif"`.
- `favicon.svg`: cuadrado 64×64 relleno `#0f0a0e`, una "M" en Instrument Serif/serif genérica 44px `#ff4d8d` centrada.

- [ ] **Step 1: Escribir `site.css`** según Interfaces (portar, no reescribir).

- [ ] **Step 2: Escribir `site.js`**, `costos_diagrama.svg` y `favicon.svg`.

- [ ] **Step 3: Verificar sintaxis**

Run: `node --check assets/js/site.js && node -e "const s=require('fs').readFileSync('assets/css/site.css','utf8');if((s.match(/{/g)||[]).length!==(s.match(/}/g)||[]).length)throw new Error('llaves');console.log('css ok')"`
Expected: sin error, `css ok`.

- [ ] **Step 4: Commit**

```bash
git add assets/css/site.css assets/js/site.js assets/img/costos_diagrama.svg assets/favicon.svg
git commit -m "feat: estilos del sitio, menú móvil, diagrama de costos y favicon"
```

---

### Task 5: `build.mjs`

**Files:**
- Create: `build.mjs`
- Test: `tests/build.test.mjs`

**Interfaces:**
- Consumes: `loadContent`, `assertSameShape`, `assertRequired` (Task 2); `renderPage` (Task 3).
- Produces: `build({ outDir = "dist", site = "https://marcelamu9.github.io/" } = {}): Promise<{ pages: string[] }>` exportada, y ejecución directa cuando `process.argv[1]` es el propio archivo. Escribe `dist/index.html` (ES, `assetBase "assets/"`), `dist/en/index.html` (EN, `assetBase "../assets/"`), copia `assets/` → `dist/assets/` (`fs.cp` recursivo), y `dist/.nojekyll` vacío. Antes de escribir: `assertSameShape(es, en)` y `assertRequired` para ambos; si fallan, lanza y no escribe nada (`process.exitCode = 1` en modo CLI).

- [ ] **Step 1: Escribir el test**

```js
test("build escribe ambas páginas y copia assets en un directorio temporal", async () => {
  const out = fs.mkdtempSync(path.join(os.tmpdir(), "site-"));
  const r = await build({ outDir: out });
  assert.deepEqual(r.pages.sort(), ["en/index.html", "index.html"]);
  assert.ok(fs.existsSync(path.join(out, "assets/css/site.css")));
  assert.ok(fs.existsSync(path.join(out, "assets/img/marcela.png")));
  assert.ok(fs.existsSync(path.join(out, ".nojekyll")));
  const es = fs.readFileSync(path.join(out, "index.html"), "utf8");
  assert.match(es, /<html lang="es"/); assert.doesNotMatch(es, /\[[A-Za-z ]+\]/);  // sin placeholders
  assert.match(fs.readFileSync(path.join(out, "en/index.html"), "utf8"), /href="\.\.\/assets\//);
});
test("build falla y no escribe si en.json no coincide con es.json", async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "content-"));
  fs.copyFileSync("content/es.json", path.join(dir, "es.json"));
  fs.writeFileSync(path.join(dir, "en.json"), JSON.stringify({ meta: {} }));
  const out = fs.mkdtempSync(path.join(os.tmpdir(), "site-"));
  await assert.rejects(build({ outDir: out, contentDir: dir }), /Clave distinta en/);
  assert.ok(!fs.existsSync(path.join(out, "index.html")));
});
```
(`build` acepta también `contentDir`, por defecto `"content"`.)

- [ ] **Step 2: Ejecutar y ver que falla**

Run: `node --test tests/build.test.mjs`
Expected: FAIL, `Cannot find module 'build.mjs'`.

- [ ] **Step 3: Implementar `build.mjs`** según Interfaces.

- [ ] **Step 4: Ejecutar todos los tests y el build real**

Run: `node --test tests/ && node build.mjs && ls dist dist/en dist/assets`
Expected: todos PASS; `dist/index.html`, `dist/en/index.html`, `dist/assets/{css,js,icons,img}`.

- [ ] **Step 5: Commit**

```bash
git add build.mjs tests/build.test.mjs
git commit -m "feat: generador estático de las dos páginas"
```

---

### Task 6: Workflow de publicación y README

**Files:**
- Create: `.github/workflows/pages.yml`, `README.md`

**Interfaces:**
- `pages.yml`: `on: push: branches: [main]` y `workflow_dispatch`; `permissions: contents: write`; job `build-deploy` en `ubuntu-latest`: `actions/checkout@v4`, `actions/setup-node@v4` con `node-version: 24`, `run: node --test tests/`, `run: node build.mjs`, `peaceiris/actions-gh-pages@v4` con `github_token: ${{ secrets.GITHUB_TOKEN }}`, `publish_dir: ./dist`, `publish_branch: gh-pages`, `force_orphan: true`.
- `README.md` en español, secciones: qué es; **Cómo cambiar un texto** (editar `content/es.json` y `content/en.json`, mismo campo en ambos; se puede hacer desde la web de GitHub con el lápiz; al guardar en `main` el sitio se publica solo en 1-2 minutos); **Cómo agregar un proyecto** (bloque de ejemplo JSON, imagen a `assets/img/`, `image` con el nombre del archivo, URL del repo); **Cómo agregar una herramienta** (`icon` con un SVG en `assets/icons/` o `letter`); **Cambiar la foto o el CV** (reemplazar `assets/img/marcela.png` o `assets/cv-marcela-garzon.pdf` con el mismo nombre); **Ver el sitio en local** (`node build.mjs` y `npx serve dist` o abrir `dist/index.html`); **Probar** (`node --test tests/`); **Cómo se publica** (push a `main` → Actions → rama `gh-pages`).

- [ ] **Step 1: Escribir `pages.yml`** según Interfaces.

- [ ] **Step 2: Validar el YAML**

Run: `node -e "const y=require('fs').readFileSync('.github/workflows/pages.yml','utf8');if(!/peaceiris\/actions-gh-pages@v4/.test(y)||!/publish_branch: gh-pages/.test(y))throw new Error('workflow');console.log('yml ok')"`
Expected: `yml ok`.

- [ ] **Step 3: Escribir `README.md`** según Interfaces.

- [ ] **Step 4: Commit**

```bash
git add .github/workflows/pages.yml README.md
git commit -m "ci: publicación en gh-pages y guía de edición"
```

---

### Task 7: Revisión visual en local

**Files:**
- Modify (solo si una captura lo exige): `assets/css/site.css`, `content/*.json`

- [ ] **Step 1: Construir y servir `dist/`**

Run: `node build.mjs && (cd dist && npx --yes serve -l 5179 .)` en segundo plano.
Expected: `http://127.0.0.1:5179/` responde 200 y `/en/` también (`curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:5179/en/`).

- [ ] **Step 2: Capturas con el kit**

Run (una por tamaño, para ES y EN):
```bash
S=.agents/skills/design-taste-frontend; P=$TEMP/claude-chrome-profile
node $S/scripts/shoot.mjs --url dist/index.html --w 1440 --out shots/es-1440.png --profile "$P"
node $S/scripts/shoot.mjs --url dist/index.html --w 390  --out shots/es-390.png  --profile "$P"
node $S/scripts/shoot.mjs --url dist/index.html --w 820  --out shots/es-820.png  --profile "$P"
node $S/scripts/shoot.mjs --url dist/index.html --w 768  --out shots/es-768.png  --profile "$P"
node $S/scripts/shoot.mjs --url dist/en/index.html --w 1440 --out shots/en-1440.png --profile "$P" --root dist
```
Expected: cinco PNG. Leerlos y comparar con `.superpowers/mockups/shots/e-1440.png`: mismas secciones, sin solapes, foto con el rostro visible, iconos en color, R y SQL en tipografía, el diagrama de costos legible en la tarjeta.

- [ ] **Step 3: Scroll horizontal a 390**

El `check.mjs` del kit no aplica (sus reglas son para sitios corporativos). Leer la captura `shots/es-390.png` y `shots/es-768.png`: ningún texto cortado por el borde derecho, nada que asome fuera de los 390 px, el menú hamburguesa visible, el botón `Escríbeme` en la cabecera. Como comprobación numérica, `shoot.mjs` imprime `tiles mobile … ` sin aviso de `overflow`; si lo imprime, hay desbordamiento.
Expected: sin cortes. Si hay un título que desborda, reducir `.pc h3` a `clamp(22px, 6vw, 28px)` bajo 639px en `site.css` y repetir el Step 2.

- [ ] **Step 4: Lighthouse móvil**

Run: `npx --yes lighthouse http://127.0.0.1:5179/ --preset=perf --form-factor=mobile --quiet --chrome-flags="--headless=new" --output=json --output-path=shots/lh.json && node -e "const r=require('./shots/lh.json').categories;console.log('perf',r.performance.score*100,'a11y',(r.accessibility||{score:0}).score*100)"`
Expected: `perf ≥ 90`. Para accesibilidad repetir sin `--preset=perf` y esperar `a11y ≥ 95`. Si falla por la foto, convertirla a `marcela.jpg` con calidad 82 (`sharp` no está: usar `magick` si existe, si no, dejarlo y anotar en el informe).

- [ ] **Step 5: Commit de ajustes (si los hubo)**

```bash
git add assets/css/site.css content
git commit -m "fix: ajustes tras revisión visual en 1440, 820 y 390"
```

---

### Task 8: Publicación y verificación en línea

- [ ] **Step 1: Confirmar que `dist/` no está en el índice**

Run: `git status --short | grep -c "^?? dist" ; git check-ignore dist && echo ignorado`
Expected: `ignorado`.

- [ ] **Step 2: Push reemplazando el repo viejo**

Run: `git push -u origin main --force`
Expected: `main -> main` en la salida. (El repo solo tenía `gh-pages` con el Jekyll de 2021; `main` es nueva. El workflow sobrescribe `gh-pages` con `force_orphan`.)

- [ ] **Step 3: Esperar el workflow**

Run (repetir hasta `completed`): `curl -s https://api.github.com/repos/marcelamu9/marcelamu9.github.io/actions/runs?per_page=1 | node -e "let s='';process.stdin.on('data',d=>s+=d).on('end',()=>{const r=JSON.parse(s).workflow_runs[0];console.log(r.status,r.conclusion,r.html_url)})"`
Expected: `completed success`.

- [ ] **Step 4: Verificar en línea**

Run: `curl -s -o /dev/null -w "%{http_code}\n" https://marcelamu9.github.io/ https://marcelamu9.github.io/en/ https://marcelamu9.github.io/assets/cv-marcela-garzon.pdf`
Expected: `200` tres veces. Luego `curl -s https://marcelamu9.github.io/ | grep -c "Marcela"` ≥ 3 y `grep -c 'lang="es"'` = 1.

- [ ] **Step 5: Informe para Marcela**

Escribir en la respuesta final: URLs, capturas, resultado de Lighthouse, y la lista de pendientes de la spec §8.4 (renombrar repos, revisar `content/*.json` y la traducción, foto nueva, gráfica del proyecto de costos). Verificar antes que las URLs de los repos nuevos en `content/es.json` redirigen (`curl -s -o /dev/null -w "%{http_code}" https://github.com/marcelamu9/customer-churn-xgboost` → `200` o `301`; si `404`, Marcela aún no renombró: dejar las URLs nuevas igual y avisarlo, GitHub redirigirá cuando renombre).
