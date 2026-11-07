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

// Compara la estructura de dos contenidos (a = es.json, b = en.json) y lanza un error que nombra
// la clave exacta que falta o sobra en el segundo archivo.
export function assertSameShape(a, b, path = "", nameA = "es.json", nameB = "en.json") {
  const where = path || "la raíz";
  const ka = kind(a), kb = kind(b);
  if (ka !== kb) throw new Error(`Clave distinta en ${where}: es ${ka} en ${nameA} y ${kb} en ${nameB}`);
  if (ka === "array") {
    if (a.length !== b.length) throw new Error(`Clave distinta en ${where}: ${a.length} elementos en ${nameA} frente a ${b.length} en ${nameB}`);
    a.forEach((v, i) => assertSameShape(v, b[i], `${path}[${i}]`, nameA, nameB));
  } else if (ka === "object") {
    const sub = (k) => (path ? `${path}.${k}` : k);
    for (const k of Object.keys(a)) if (!(k in b)) throw new Error(`Clave distinta en ${sub(k)}: falta en ${nameB}`);
    for (const k of Object.keys(b)) if (!(k in a)) throw new Error(`Clave distinta en ${sub(k)}: sobra en ${nameB}`);
    for (const k of Object.keys(a)) assertSameShape(a[k], b[k], sub(k), nameA, nameB);
  }
}

export function assertRequired(content, lang) {
  for (const p of REQUIRED) {
    const v = p.split(".").reduce((o, k) => (o == null ? undefined : o[k]), content);
    if (v === undefined || v === null || v === "") throw new Error(`Falta ${p} en ${lang}.json`);
  }
}
