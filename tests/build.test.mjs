import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { build } from "../build.mjs";

test("build escribe ambas páginas y copia assets en un directorio temporal", async () => {
  const out = fs.mkdtempSync(path.join(os.tmpdir(), "site-"));
  const r = await build({ outDir: out });
  assert.deepEqual(r.pages.sort(), ["en/index.html", "index.html"]);
  assert.ok(fs.existsSync(path.join(out, "assets/css/site.css")));
  assert.ok(fs.existsSync(path.join(out, "assets/img/marcela.png")));
  assert.ok(fs.existsSync(path.join(out, ".nojekyll")));
  const es = fs.readFileSync(path.join(out, "index.html"), "utf8");
  assert.match(es, /<html lang="es"/);
  assert.doesNotMatch(es, /\[[A-Za-z ]+\]/);
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
