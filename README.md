# marcelamu9.github.io

Sitio personal de Marcela Garzón, científica de datos y estadística. Una sola página, en español (`/`) y en inglés (`/en/`), generada a partir de dos archivos de contenido. No hay frameworks ni dependencias: solo Node.

- **Sitio:** https://marcelamu9.github.io
- **Contenido:** `content/es.json` (español) y `content/en.json` (inglés)
- **Imágenes, iconos, CV:** `assets/`
- **Generador:** `build.mjs` → escribe `dist/`

## Cómo cambiar un texto

1. Abre `content/es.json` y busca el texto. Cada bloque corresponde a una parte de la página:

   | Bloque | Qué contiene |
   |---|---|
   | `hero` | La frase de la portada (`lead`) y las tres capacidades (`does`) |
   | `about` | Título, párrafos de "Sobre mí" (`paragraphs`) y formación (`facts`) |
   | `experience.items` | Un bloque por empresa: fechas, cargo y el párrafo de logro |
   | `projects.items` | Un bloque por proyecto: título, stack (`tag`), descripción y fichas (`metrics`) |
   | `tools.items` | La lista de herramientas |
   | `contact` | El cierre y los enlaces |

2. Cambia solo lo que va entre comillas a la derecha de cada clave. No cambies los nombres de las claves ni quites comas.
3. Haz el mismo cambio en `content/en.json` (misma clave, texto en inglés). Si un idioma tiene una clave de más o de menos, la publicación se detiene y avisa cuál.
4. Guarda y sube el cambio a la rama `main` (`git push`), o edítalo directamente en GitHub con el lápiz. En uno o dos minutos el sitio se actualiza solo.

## Cómo agregar un proyecto

1. Pon la imagen del proyecto en `assets/img/` (PNG o JPG, ancho máximo 1600 px, o un SVG).
2. En `content/es.json`, dentro de `projects.items`, copia un bloque existente y cámbialo:

   ```json
   {
     "title": "Nombre del proyecto",
     "tag": "Python · scikit-learn · dataset público",
     "text": "Dos o tres frases en primera persona: qué había, qué hice, qué salió.",
     "metrics": [
       { "label": "ROC-AUC", "value": "0,81" },
       { "label": "Registros", "value": "12 000" }
     ],
     "image": "nombre-de-la-imagen.png",
     "imageAlt": "Qué muestra la imagen",
     "url": "https://github.com/marcelamu9/nombre-del-repo"
   }
   ```

   Un proyecto sin imagen (`"image": ""`) o sin métricas (`"metrics": []`) también funciona.
3. Repite el bloque en `content/en.json`, en la misma posición, con los textos en inglés.
4. El orden de la lista es el orden en la página.

## Cómo agregar una herramienta

En `tools.items` de los dos archivos, añade una línea:

- con icono: `{ "name": "Airflow", "icon": "airflow.svg", "iconClass": "" }` y el SVG en `assets/icons/` (`iconClass` puede ser `ic-land` para logos anchos o `ic-tall` para logos altos);
- sin icono: `{ "name": "SQL", "letter": "SQL", "letterColor": "#f6f1f4" }`.

## Cambiar la foto o el CV

Reemplaza el archivo con el mismo nombre: `assets/img/marcela.png` o `assets/cv-marcela-garzon.pdf`.

## Ver el sitio en local

```bash
node build.mjs          # genera dist/
npx serve dist          # o abre dist/index.html en el navegador
```

## Probar

```bash
node --test "tests/*.test.mjs"
```

## Cómo se publica

Cada `push` a `main` ejecuta `.github/workflows/pages.yml`: corre las pruebas, genera `dist/` y lo publica en la rama `gh-pages`, que es la que sirve GitHub Pages. `dist/` no se guarda en el repositorio.

## Estructura

```
content/      es.json, en.json
assets/       css/ (system.css del kit base + site.css), js/, icons/, img/, favicon.svg, el CV
lib/          content.mjs (carga y validación), render.mjs (HTML), icons.mjs
tests/        pruebas con node:test
build.mjs     generador
docs/         especificación y plan del diseño
```
