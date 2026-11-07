// Carga y validación del contenido (content/es.json, content/en.json).
import { readFileSync } from "node:fs";
import { join } from "node:path";

export const REQUIRED = ["meta.title", "meta.description", "hero.name", "hero.surname", "hero.lead", "contact.email"];

export function loadContent(lang, dir = "content") {
  return JSON.parse(readFileSync(join(dir, `${lang}.json`), "utf8"));
}

function kind(v) {
  if (Array.isArray(v)) return "array";
  if (v !== null && typeof v === "object") return "object";
  return "value";
}

export function assertSameShape(a, b, path = "") {
  const ka = kind(a), kb = kind(b);
  if (ka !== kb) throw new Error(`Clave distinta en ${path || "(raíz)"}: ${ka} frente a ${kb}`);
  if (ka === "array") {
    if (a.length !== b.length) throw new Error(`Clave distinta en ${path || "(raíz)"}: ${a.length} elementos frente a ${b.length}`);
    a.forEach((v, i) => assertSameShape(v, b[i], `${path}[${i}]`));
  } else if (ka === "object") {
    const keysA = Object.keys(a).sort(), keysB = Object.keys(b).sort();
    if (keysA.join("\u0000") !== keysB.join("\u0000")) {
      throw new Error(`Clave distinta en ${path || "(raíz)"}: {${keysA.join(", ")}} frente a {${keysB.join(", ")}}`);
    }
    for (const k of keysA) assertSameShape(a[k], b[k], path ? `${path}.${k}` : k);
  }
}

export function assertRequired(content, lang) {
  for (const p of REQUIRED) {
    const v = p.split(".").reduce((o, k) => (o == null ? undefined : o[k]), content);
    if (v === undefined || v === null || v === "") throw new Error(`Falta ${p} en ${lang}.json`);
  }
}
