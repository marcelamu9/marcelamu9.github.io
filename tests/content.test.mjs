import { test } from "node:test";
import assert from "node:assert/strict";
import { loadContent, assertSameShape, assertRequired } from "../lib/content.mjs";

test("es.json y en.json tienen la misma estructura", () => {
  assertSameShape(loadContent("es"), loadContent("en"));
});

test("ambos tienen las claves obligatorias", () => {
  for (const l of ["es", "en"]) assertRequired(loadContent(l), l);
});

test("assertSameShape nombra la ruta de la clave distinta", () => {
  assert.throws(() => assertSameShape({ a: { b: 1 } }, { a: { c: 1 } }), /Clave distinta en a/);
  assert.throws(() => assertSameShape({ p: [1, 2] }, { p: [1] }), /Clave distinta en p/);
});

test("los proyectos son 4 y la experiencia va de la más reciente a la más antigua", () => {
  const es = loadContent("es");
  assert.equal(es.projects.items.length, 4);
  assert.equal(es.experience.items[0].company, "Fluid Attacks");
  assert.equal(es.experience.items.at(-1).company, "Grupo BIT");
  assert.equal(es.experience.items.filter((i) => i.current).length, 1);
});

test("ninguna tarjeta de proyecto usa palabras de impacto", () => {
  for (const p of loadContent("es").projects.items) {
    assert.doesNotMatch(p.text + p.title, /impacto|resultado de negocio|clientes reales/i);
  }
});
