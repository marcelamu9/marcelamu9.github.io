// Genera el sitio: dist/index.html (ES), dist/en/index.html (EN) y copia assets/.
// Uso: node build.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadContent, assertSameShape, assertRequired } from "./lib/content.mjs";
import { renderPage } from "./lib/render.mjs";

export async function build({ outDir = "dist", contentDir = "content", assetsDir = "assets", site = "https://marcelamu9.github.io/" } = {}) {
  const es = loadContent("es", contentDir);
  const en = loadContent("en", contentDir);
  assertSameShape(es, en);
  assertRequired(es, "es");
  assertRequired(en, "en");

  const pages = [
    { file: "index.html", content: es, opts: { assetBase: "assets/", canonical: site, alternate: `${site}en/` } },
    { file: "en/index.html", content: en, opts: { assetBase: "../assets/", canonical: `${site}en/`, alternate: site } },
  ];

  fs.mkdirSync(outDir, { recursive: true });
  for (const p of pages) {
    const target = path.join(outDir, p.file);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, renderPage(p.content, p.opts));
  }
  fs.cpSync(assetsDir, path.join(outDir, "assets"), { recursive: true });
  fs.writeFileSync(path.join(outDir, ".nojekyll"), "");
  return { pages: pages.map((p) => p.file) };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  build()
    .then((r) => console.log(`Generado: ${r.pages.join(", ")} en dist/`))
    .catch((err) => { console.error(`Error: ${err.message}`); process.exitCode = 1; });
}
