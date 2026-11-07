# Portafolio de Marcela Garzón — documento de diseño

Fecha: 2026-11-06 · Estado: borrador para revisión · Maqueta de referencia: `.superpowers/mockups/e.html` (abrir con `node .superpowers/mockups/serve.mjs` → http://127.0.0.1:5178/e.html)

## 1. Intención

Un sitio personal de una página, en `https://marcelamu9.github.io`, para que reclutadores y líderes de datos entiendan en diez segundos quién es Marcela Garzón (científica de datos y estadística, seis años de experiencia, trabajo remoto desde Colombia), vean evidencia real y la contacten. Es la base de su marca personal: se irá actualizando con proyectos nuevos.

**Por qué:** busca ofertas en Colombia, Latinoamérica y remotas. Un fracaso sería que no la contacten, que la página sea confusa, o que no impacte en los primeros segundos. Un segundo fracaso, igual de grave: que parezca que exagera o miente.

## 2. Lectores de la página

1. **Reclutador no técnico** (filtro inicial): escanea nombre, rol, años, ubicación, contacto y "quién es esta persona". Necesita rostro, frase clara, botón de contacto visible siempre.
2. **Líder de datos** (decide la entrevista): mira stack, experiencia con logros concretos, proyectos con código, y cómo comunica.

## 3. Metas, no metas y antimetas

**Metas**
- Primera pantalla: nombre, rol, seis años de experiencia, foto, tres cosas que hace, botón *Escríbeme*.
- Una sola acción principal, *Escríbeme* (`mailto:Marcelamu9@gmail.com`), en cabecera, portada y cierre. WhatsApp, LinkedIn, GitHub y CV como acciones secundarias.
- Español por defecto, inglés completo con conmutador ES/EN.
- Que Marcela pueda editar textos y agregar proyectos sin tocar HTML ni CSS.
- Verse "persona con criterio y resultados", no empresa ni plantilla.
- Rápida y correcta en escritorio (1440), tablet (768/820) y móvil (390).

**No metas**
- Blog, formulario con backend, analítica, modo claro, animaciones de scroll, varias páginas. Pueden venir después.
- Dominio propio (se puede conectar luego sin rehacer nada).

**Antimetas (lo que haría fallar el proyecto aunque "funcione")**
- Cualquier dato que no esté en el CV o en GitHub: no inventar logros, empresas, formación, hobbies, cifras, testimonios ni logos de clientes.
- Presentar los proyectos de práctica como resultados de negocio reales.
- Una franja de cifras tipo "6 años · 4 empresas · 4 proyectos" (se descartó: puede jugar en contra).
- Fondo con degradados, brillos, ondas; cajas con sombra; carruseles; cosas que se mueven solas.
- Copiar código, textos o imágenes de otro sitio.

## 4. Restricciones

- **Hosting:** GitHub Pages, repo público existente `marcelamu9/marcelamu9.github.io` (hoy tiene una página Jekyll de 2021 con `index.md` y `_config.yml`, rama `gh-pages`; se reemplaza por completo). Solo estático: HTML, CSS, JS, imágenes, PDF.
- **Dónde se construye y quién publica:** la carpeta de trabajo `C:\Users\marcela\Documents\portfolio\portfolio` se convierte en el repo del sitio (`git init`, remoto `marcelamu9.github.io`, rama `main`). Quien construye tiene acceso de escritura al repo por el conector de GitHub de esta sesión (`push_files`) y por `git` local; publica directamente. Los archivos viejos de Jekyll se borran en el primer push. `dist/` **no** se versiona (va en `.gitignore`): lo genera el workflow en cada push. El repo guarda `content/`, `templates/`, `assets/`, `build.mjs`, el workflow y el README. Carpetas que no van al repo: `.agents/`, `.superpowers/`, `.taste-skill/`, `portfolio/` (el CV y la foto originales se copian a `assets/`).
- **Publicación sin tocar la configuración de Pages:** el repo ya publica desde la rama `gh-pages` (configurado en 2021 y verificado: en Settings → Pages Marcela solo ve "Add a domain"). Se mantiene así: `main` guarda las fuentes; el workflow de GitHub Actions construye `dist/` y lo empuja a la rama `gh-pages` (con `peaceiris/actions-gh-pages` o un `git push` equivalente desde el workflow, `publish_dir: dist`, `force_orphan: true`). Marcela no cambia ninguna opción. Si en el futuro Pages dejara de servir desde `gh-pages`, el plan B es Source = GitHub Actions.
- **Identidad:** el nombre completo es Lina Marcela Garzón Muñoz (así aparece en el CV, `curriculo Lina Garzon 2026-10.pdf`, y en GitHub). La marca y el nombre en el sitio es **Marcela Garzón**; el PDF se publica como `assets/cv-marcela-garzon.pdf` tal cual, sin editarlo.
- **Sin dependencias de servidor ni frameworks.** Node 24 está disponible en la máquina de Marcela para el script de construcción. No hay `gh` CLI.
- **Idioma de trabajo:** el repo, los comentarios y la documentación de uso en español.
- **Foto:** provisional, 400×400 px (`portfolio/image.png`). Se reemplazará; el diseño no debe depender de un tamaño exacto.
- **Contacto público:** correo `Marcelamu9@gmail.com` y WhatsApp `+57 314 769 8713` (enlace `https://wa.me/573147698713`); Marcela aceptó exponerlos.
- **Kit de diseño:** el kit tasteskill en `.agents/skills/design-taste-frontend` se usa solo por su base de CSS (`system.css`: tokens, cabecera, botones, grid; `motion/motion.css`: hovers; `icons/icon.css` e `icons.mjs`: iconos reales; `diagrams/`: el diagrama del proyecto de costos). **No** se sigue su plan de página, sus reglas de redacción ni su checker de "una sección por pantalla": esta es una página personal, no corporativa. Sus archivos se copian al repo del sitio (no se enlaza la carpeta de la skill).

## 5. Decisiones de diseño (tomadas con Marcela)

### 5.1 Sistema visual
- Fondo único oscuro ciruela `#0f0a0e`; superficie `#171015`; texto `#f6f1f4`; texto secundario `#a89ea4`; un acento rosa `#ff4d8d`. Líneas de 1 px al 13 % de blanco. Sin degradados ni brillos.
- Tipografía: **Instrument Serif** (nombre, titulares, cursivas de énfasis) + **Chivo** 400/500 (texto). Google Fonts con `display=swap`.
- Esquinas rectas (`data-radius="sharp"`), botones con flecha (`data-buttons="arrow"`), cabecera fija de 72 px con línea inferior.
- Un patrón de titular en todas las secciones: etiqueta pequeña con rayita rosa ("Sobre mí"), luego el titular en serif con una palabra en cursiva rosa.
- Movimiento solo como respuesta al usuario: botones que empujan la flecha, subrayados que se dibujan, imágenes que se acercan 3 % al pasar el cursor, bordes de tarjeta que se tiñen de rosa. Nada por scroll ni en carga. Respetar `prefers-reduced-motion`.

### 5.2 Estructura (una página, en este orden)
1. **Portada** — Etiqueta "Científica de datos y estadística". Nombre "Marcela *Garzón*". Frase: "Llevo seis años convirtiendo datos en decisiones de negocio con estadística y machine learning, desde la exploración hasta la puesta en producción." Botones: *Escríbeme* (primario) y *Ver proyectos* (secundario, ancla). Foto 4:5 en el centro. A la derecha, tres cosas que hace, con icono de línea: Modelos predictivos / Analítica de clientes / Datos en producción.
2. **Sobre mí** — "La persona detrás de los *modelos*". Dos párrafos en primera persona. Columna lateral: Estadística, Universidad del Valle (2012–2017); Ingeniería de Datos e IA con AWS (en curso, 2026); DS4A Colombia 2.0 (Correlation One, 2020), ML con Scikit-Learn (Platzi, 2021), Applied Data Science with Python (Coursera, 2020).
3. **Experiencia** — "Mi recorrido en *datos*". Línea de tiempo horizontal, **de la más reciente a la más antigua**, el punto actual en rosa: Fluid Attacks (dic 2024–hoy, remoto), CODESA (abr 2023–abr 2024, Cali), Matrix Kassier Sured (ago 2021–mar 2023, remoto), Grupo BIT (feb 2019–ago 2021, Cali; junior y semi senior en un solo nodo). Cada nodo: fechas y lugar, empresa en serif, cargo, un párrafo con el logro medible del CV. Aquí viven los resultados reales.
4. **Proyectos** — "Lo que construyo para seguir *aprendiendo*". Entrada que lo dice una sola vez: "Ejercicios y retos técnicos con datos públicos o de prueba, que uso para practicar y mantenerme al día. Todo el código está abierto en GitHub; las métricas son las del ejercicio." Tarjetas en cuadrícula de dos columnas, cada una un enlace al repo: imagen 2:1 arriba, etiqueta del stack, título en serif, descripción de dos o tres frases en primera persona, fichas de métricas (`ROC-AUC 0,78`), "Ver en GitHub →". Cuatro al lanzar (ver §6); el número crece con el tiempo.
5. **Herramientas** — "Con lo que *trabajo*". Una frase y un mosaico de 12 fichas: Python, R, SQL, scikit-learn, Snowflake, dbt, PySpark, AWS, Power BI, QuickSight, Jupyter, Git. Icono oficial en color donde existe un icono libre (`icons.mjs`): Python, scikit-learn, Snowflake, dbt, Apache Spark (para PySpark), AWS, Power BI, QuickSight, Jupyter, Git. **R y SQL van en tipografía** (la letra o la sigla en serif, en el color de la marca o del texto): no se usa el logo de PostgreSQL ni de otro motor para "SQL", porque el CV no nombra un motor.
6. **Cierre** — "¿Tienes un reto de datos? *Hablemos.*" Línea: "Me gusta trabajar en problemas reales, desde la idea hasta su efecto en el negocio. Respondo en menos de un día." Botón con el correo; iconos WhatsApp, LinkedIn, GitHub; enlace CV. Línea legal: © año, Marcela Garzón · Colombia, y el enlace al otro idioma.

Cabecera: logo "Marcela Garzón" (texto en serif), palabras Sobre mí · Recorrido · Proyectos · Herramientas, conmutador ES/EN, botón *Escríbeme*. En móvil, menú de pantalla completa (lo da `system.js`).

### 5.3 Reglas de contenido
- **Solo hechos del CV (`portfolio/curriculo Lina Garzon 2026-10.pdf`) y de GitHub.** Si algo no está ahí, no entra. Lista de lo descartado del boceto de Marcela por no ser real: SENA, Magneto, "4+ modelos en producción", hobbies.
- **Experiencia = impacto real** (los logros del CV). **Proyectos = práctica en público**: nunca "impacto", "resultado de negocio" ni "clientes" en las tarjetas; las métricas se nombran con su nombre técnico y nada más.
- Primera persona en toda la página. Sin saludos vacíos ni eslóganes; sin relleno ("innovador", "apasionada por", "soluciones de vanguardia").
- Cifras como en el CV: "seis años" (aunque desde 2019 sean más), "precisión superior al 70 %", "más del 30 % de los clientes", "80 % de la cartera", "50 % de los modelos".
- Inglés: traducción completa, natural, no literal. Marcela la revisa; su nivel de inglés está en progreso, así que la traducción debe ser conservadora y clara, sin modismos.
- **Los textos ya existen como borrador:** todo el texto en español de la maqueta `e.html` (frase de portada, tres capacidades, los dos párrafos de "Sobre mí", el párrafo de cada empresa, la entrada y las cuatro tarjetas de proyectos, la frase de herramientas, el cierre) es la versión 1 y se copia tal cual a `content/es.json`. Fue redactado a partir del CV y de los README de los repos; Marcela lo revisará y corregirá sobre el JSON. Quien construye no redacta contenido nuevo: si una clave queda sin texto en la maqueta, se deja vacía y se reporta.

### 5.4 Contenido editable sin tocar código
- Todo el texto vive en **`content/es.json`** y **`content/en.json`** (misma estructura, claves iguales). Secciones: `meta`, `nav`, `hero`, `about`, `experience[]`, `projects[]`, `tools[]`, `contact`.
- Un proyecto es una entrada: `{ "id", "title", "tag", "text", "metrics": [{ "label", "value" }], "image", "url", "order" }`. Agregar un proyecto = una entrada en cada JSON + una imagen en `assets/img/`.
- **`build.mjs`** (Node, sin dependencias) lee los JSON y una plantilla y escribe `index.html` (ES) y `en/index.html` (EN). Se ejecuta con `node build.mjs`.
- **GitHub Actions** construye y publica en cada push a `main` (workflow `pages.yml`: `node build.mjs` → push de `dist/` a la rama `gh-pages`, de donde Pages ya sirve). Marcela solo edita JSON y hace push, o edita el JSON directamente en la web de GitHub; no necesita correr nada en local, aunque puede.
- **Estructura de `content/*.json`** (misma en ambos idiomas): `meta` (title, description), `nav[]`, `hero` (eyebrow, name, surname, lead, buttons, does[] con icon/title/text), `about` (eyebrow, title, titleAccent, paragraphs[], facts[] con icon/text/sub), `experience` (eyebrow, title, titleAccent, lead, items[] con when/company/role/text/current), `projects` (eyebrow, title, titleAccent, lead, items[] con title/tag/text/metrics[]{label,value}/image/url), `tools` (eyebrow, title, titleAccent, lead, items[] con name y icon **o** letter), `contact` (eyebrow, title, titleAccent, text, email, whatsapp, linkedin, github, cv), `footer` (legal). Los iconos de `hero.does` y `about.facts` son nombres de un pequeño conjunto de SVG de línea incluidos en la plantilla (trending-up, users, database, graduation-cap, briefcase).
- `README.md` del repo explica en español: cómo cambiar un texto, cómo agregar un proyecto, cómo cambiar la foto o el CV, cómo ver el sitio en local.

### 5.5 Los cuatro proyectos al lanzar
| Repo (nombre actual → nuevo, Marcela lo renombra) | Imagen | Métricas en fichas |
|---|---|---|
| `aws-olist-data-pipeline` | `docs/screenshots/stepfunctions_graph.png` del repo | ROC-AUC 0,78 · Recall 44,5 % · Tasa de retraso 8,11 % |
| `desafio_tecnico` → `price-anomalies-ml-vs-llm` | `visualizations/ej1_item_MLB1632127417.png` | F1 LLM 0,85 · F1 IForest 0,62 · p 0,042 |
| `modelo_predictivo_fuga_colombina` → `customer-churn-xgboost` | `img/boxplot_metricas_clasificacion.png` | Clientes 80 294 · Fugados 13 % · Modelos 6 |
| `gestion_costos_operativos` → `equipment-cost-forecasting` | No tiene figura: diagrama de pasos del kit (`timeline`) hasta que Marcela exporte una gráfica | OLS + ARIMA · Monte Carlo |

Los enlaces usan los nombres nuevos; GitHub redirige los viejos, así que funcionan en cualquier orden. Opcional, recomendado: un archivo `charts.mplstyle` (fondo oscuro, rosa) para que Marcela re-exporte las gráficas con un solo estilo.

Las imágenes ya están descargadas de los repos públicos en `.superpowers/mockups/assets/img/` (`olist_stepfunctions.png`, `desafio_item1.png`, `churn_metrics.png`); se copian a `assets/img/` del sitio. Tienen fondo claro: se muestran tal cual dentro de la tarjeta, con la parte superior de la tarjeta en blanco como en la maqueta (no se recolorean ni se les pone marco extra). El diagrama del proyecto de costos puede usar el JS del kit (`diagrams/diagram.js` + `mount.js`, montado en el navegador) o un SVG estático generado una vez; cualquiera de los dos vale, el estático es preferible si no cuesta más de una hora.

### 5.6 Imágenes y activos
- Foto: `assets/img/marcela.jpg`; se sirve con `object-fit: cover; object-position: 50% 18%` para que cualquier recorte conserve el rostro. Al cambiarla, basta reemplazar el archivo.
- CV: `assets/cv-marcela-garzon.pdf` (copia del PDF actual; se reemplaza igual).
- Iconos: SVG locales en `assets/icons/`, obtenidos con `icons.mjs fetch … --colour` del kit; nunca desde un CDN. Los de AWS (Glue, Athena, QuickSight) son violeta por marca: se dejan en su color, pequeños.
- Imágenes de proyectos: PNG/JPG locales, máximo 1600 px de ancho, con `loading="lazy"`.

### 5.7 Calidad
- Contraste AA en todo el texto (el gris secundario `#a89ea4` sobre `#0f0a0e` da ≈ 7:1).
- Sin scroll horizontal a 390 px; un solo botón primario visible por vista; objetivos táctiles ≥ 44 px.
- HTML semántico: un `h1`, `h2` por sección, `nav`, `main`, `footer`, `alt` en toda imagen con contenido.
- `<html lang="es">` / `lang="en"`, `hreflang` cruzado, `<title>` y `<meta name="description">` por idioma, Open Graph con la foto, favicon simple (la "M" en serif sobre ciruela).
- Lighthouse en móvil: rendimiento ≥ 90, accesibilidad ≥ 95.

## 6. Qué queda al criterio de quien construye
- Los nombres de archivos y la estructura exacta de `content/*.json`, mientras cumplan §5.4.
- Cómo generar el menú móvil (puede reutilizar `system.js` del kit o escribir uno propio de 30 líneas).
- Los textos en inglés (borrador para que Marcela revise).
- El estilo de matplotlib opcional y el favicon.
- Cómo recortar el diagrama del proyecto de costos para que mida 2:1 como las imágenes.

## 7. Fuera del alcance de la primera versión, previsto
- Página o sección de blog; sección de certificaciones con enlaces; dominio propio; modo claro; formulario con Formspree.

## 8. Entrega
1. Repo `marcelamu9.github.io` reemplazado en `main`: `content/`, `templates/`, `assets/`, `build.mjs`, `.github/workflows/pages.yml`, `README.md`, `.gitignore` (con `dist/`). `dist/` se genera en local para verificar y en el workflow para publicar.
2. Sitio en línea en `https://marcelamu9.github.io` en español y `https://marcelamu9.github.io/en/` en inglés, publicado por el workflow en `gh-pages`. La verificación previa se hace sobre `dist/` servido en local.
3. Capturas a 1440, 820, 768 y 390 revisadas; Lighthouse adjunto.
4. Lista de pendientes para Marcela: renombrar los tres repos, revisar los textos en `content/es.json` y la traducción en `content/en.json`, reemplazar la foto cuando tenga una nueva, exportar una gráfica para el proyecto de costos.
