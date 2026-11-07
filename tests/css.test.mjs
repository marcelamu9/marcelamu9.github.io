import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const css = fs.readFileSync("assets/css/site.css", "utf8");
const mobile = css.slice(css.indexOf("@media (max-width: 639px)"));

test("en móvil las cuadrículas usan minmax(0, 1fr) para que una palabra larga no ensanche la página", () => {
  for (const sel of [".hero-g", ".tl", ".cards"]) {
    const rule = mobile.match(new RegExp(`\\${sel} \\{[^}]*\\}`));
    assert.ok(rule, `falta la regla móvil de ${sel}`);
    assert.match(rule[0], /grid-template-columns: minmax\(0, 1fr\)/, `${sel} debe usar minmax(0, 1fr)`);
  }
  assert.match(css, /\.pc \.body \{[^}]*grid-template-columns: minmax\(0, 1fr\)/);
});

test("los textos de tarjetas y línea de tiempo pueden partirse en cualquier punto", () => {
  assert.match(css, /\.pc h3, \.pc \.tag, \.pc p, \.tl h3, \.tl \.role, \.tl \.did, \.chips span \{ overflow-wrap: anywhere; \}/);
});
