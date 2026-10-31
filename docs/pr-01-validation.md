# PR-01 · Using Web Components

Revisión de implementación: 31 de octubre de 2026. Rama `feat/01-using-web-components`. **Entrega implementada, pendiente de aprobación técnica final en navegador compatible.** No se hace commit, push, merge ni despliegue. No se inicia PR-02 ni se divide el capítulo en otras PR.

## Base y alcance

Antes de editar se comprobó árbol limpio en `main`, se ejecutó `git fetch origin main` con elevación y `git rev-list --left-right --count main...origin/main` devolvió `0 0`. La base es `f06d398` (PR-00 integrada). Se creó exclusivamente la rama solicitada.

Se leyeron las ocho Skills principales de `.agents/skills`, más project-scaffolding para dependencias y devops-vercel para CI. Las diez siguen reconocidas en el catálogo; sus cuerpos no se modifican.

El capítulo está en `/capitulos/01-using-web-components/` con siete lecciones:

| Lección                     | Resultado que practica                                    |
| --------------------------- | --------------------------------------------------------- |
| `01-bibliotecas`            | npm, import, registro, contrato y selección de biblioteca |
| `02-temas`                  | Tokens, herencia, claro/oscuro y excepciones locales      |
| `03-personalizacion`        | Encapsulación, host, part, exportparts y slotted          |
| `04-elementos-no-definidos` | defined, upgrade y contenido útil previo al registro      |
| `05-javascript`             | Atributos, propiedades, métodos, payload y propagación    |
| `06-frameworks`             | Integraciones reales React/Astro y recetas Angular/Vue    |
| `07-renderizado`            | CSR/SSR/SSG, DSD y mejora progresiva real                 |

Cada página tiene introducción, objetivos, desarrollo conceptual, demo/código aplicable, buenas prácticas, errores, resumen, pregunta de entrevista, referencias y navegación. El contenido es original desde fuentes públicas; el índice temático no autoriza copiar el curso privado.

## Laboratorios y material

Ocho rutas bajo `/laboratorios/using-web-components/`: `bibliotecas`, `temas`, `parts`, `registro`, `inspector`, `eventos`, `frameworks` y `renderizado`. Comparten una envoltura Astro con descripción, objetivo, vista, fuentes reales desplegables y accesibilidad. No hay ejecución de código arbitrario.

- Biblioteca real: `wa-button` de Web Awesome 3.14.0. Los controles del lab usan Lit; el botón procede del paquete.
- Referencia propia: `lab-reading-card`, propiedades de texto/booleanos/objeto, `reset()`, `lesson-select`, tokens, partes y slot. `lab-card-frame` reexporta partes; `lab-deferred-note` separa clase y registro.
- React 19.3.1 pasa objetos y escucha eventos sin wrapper; conserva ref y desmonta su raíz. Astro conecta HTML y DOM APIs sin importar clases DOM en frontmatter.
- `lab-static-summary` conserva texto de SSG y mejora Light DOM. La demo DSD crea una raíz con el parser HTML y no registra una clase. **No es SSR ni hidratación completa de Lit.**
- Tres diagramas Mermaid originales en `diagrams/using-*.mmd`, con título y descripción.
- Deck Marp `presentations/using-web-components.md`, generado en `/slides/using-web-components.html` y enlazado desde el portal.
- Ejercicios básico, intermedio y avanzado bajo `/ejercicios/using-web-components/`, con enunciados y soluciones separados en `exercises/`. Las soluciones se abren voluntariamente. Los consumidores básico/intermedio y la integración avanzada se importan del código probado.

La portada anuncia el capítulo, la ruta marca solo PR-01 como disponible y la URL anterior redirige de forma estática. El progreso v2 cuenta ocho lecciones disponibles, conserva la lectura v1 y borra ambas claves al desactivar. Los capítulos 02–11 mantienen estado pendiente.

## Arquitectura y dependencias

[ADR-0005](adr/0005-using-web-components.md) y [mapa de módulos](architecture.md). Se conserva un proyecto estático con separación entre contenido, vista Astro, ejemplos, consumidores y contratos puros. Lit posee sus templates; React posee su contenedor. Los consumidores modifican APIs públicas, no raíces shadow ajenas.

Se añaden Web Awesome 3.14.0, React/React DOM 19.3.1 y tipos 19.3.0 por requisitos educativos. `@astrojs/markdown-satteri` 0.4.6, ya transitiva, se declara directamente en desarrollo para su API pública de transformación. Licencias MIT y peers revisados; pnpm actualiza el lockfile. No se instala Angular/Vue ni un adaptador SSR. React y Web Awesome se importan solo desde las demos correspondientes.

`ec.config.mjs` configura el hook de código; Sätteri configura las tablas. El HTML generado permite enfocar regiones de código/tablas con scroll. `pnpm docs:check` verifica ese atributo, archivos y fragmentos sin ejecutar JavaScript; se añade a check y CI.

## Evidencia de validación

Resultados reales. `pnpm check` alcanzó E2E y terminó con salida 1 por navegadores ausentes. Después se reprodujo y corrigió la regresión de retirada de `heading`: se repitieron formato, lint, tipos, Vitest y build/enlaces. No se repitieron los 126 lanzamientos fallidos, cuya causa externa no ha cambiado.

| Comprobación                                                                                           | Resultado                                                                                                                                                                                                                           |
| ------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm install --frozen-lockfile`                                                                       | Pasa; lockfile consistente con versiones fijadas                                                                                                                                                                                    |
| Instalación limpia con manifiestos en directorio temporal, `--frozen-lockfile --offline` y store local | Pasa en `/private/tmp/wcel-pr01-clean-_ol4cl62`: 820 paquetes reutilizados, cero descargas, sin node_modules previo. No demuestra descarga limpia de npm.                                                                           |
| `pnpm lint`                                                                                            | Pasa, sin avisos                                                                                                                                                                                                                    |
| `pnpm typecheck`                                                                                       | Pasa: 49 archivos Astro, cero errores/avisos/hints; tsc termina con salida 0                                                                                                                                                        |
| `pnpm test`                                                                                            | 47 pruebas pasadas en 9 archivos: 28 previas y 19 nuevas; incluye la regresión de heading retirado                                                                                                                                  |
| `pnpm build`                                                                                           | Pasa; 40 rutas, dos presentaciones y búsqueda Pagefind                                                                                                                                                                              |
| `pnpm docs:check`                                                                                      | Pasa: 43 HTML y 2.129 referencias locales/fragmentos; código y tablas con acceso de teclado                                                                                                                                         |
| `pnpm exec playwright test --list`                                                                     | 126 casos descubiertos en tres motores; listar no ejecuta pruebas                                                                                                                                                                   |
| Instalación de Chromium/Firefox/WebKit con elevación                                                   | Falla: `Playwright does not support chromium on mac12`                                                                                                                                                                              |
| E2E                                                                                                    | 126 casos intentados, todos fallan en browserType.launch por los ejecutables ausentes de Chromium, Firefox y WebKit. Ningún cuerpo valida la interfaz. Informes y trazas en playwright-report/ y test-results/ (ignorados por Git). |
| `pnpm check`                                                                                           | Salida 1 en E2E. Pasan Skills, formato, lint, tipos, tooling, Vitest, build y docs:check. El diff final del script no se alcanza y se ejecuta por separado.                                                                         |
| `pnpm skills:check`, formato y tooling                                                                 | Diez Skills válidas, Prettier correcto y 3 pruebas de tooling pasadas.                                                                                                                                                              |
| `git diff --check` y archivos nuevos                                                                   | Pasa; además, 75 archivos nuevos comprobados con git diff --no-index --check contra /dev/null, sin errores de espacios.                                                                                                             |
| Auditoría de producción                                                                                | Cero avisos                                                                                                                                                                                                                         |
| Auditoría completa                                                                                     | Salida 1: 11 avisos (1 crítico, 4 altos, 5 moderados, 1 bajo), todos en tooling                                                                                                                                                     |

Las pruebas nuevas verifican API, registro, objetos, retirada de atributos, atributos booleanos, escape de texto, eventos que cruzan una raíz, upgrade tardío, métodos silenciosos, reconexión, límite/pausa de eventos, reexportación, controles de tema, consumidores Astro/React, ejercicios y progreso/migración. JSDOM no demuestra estilos computados ni interoperabilidad real de navegadores.

La suite E2E añade recorrido de las siete lecciones, biblioteca npm con teclado/disabled, inspector, tokens computados, partes directas/anidadas, registro tardío, integración, DSD y modo sin JavaScript, progreso migrado, soluciones cerradas, presentación, redirección y capturas. Reflow y axe se preparan en 320, 375, 768, 1280 y 1440 px; también temas, RTL, reduced motion y forced colors. Los errores de consola fallan las pruebas. **Nada de esto se declara aprobado sin ejecutar navegador.**

## CI existente y correcciones

La [CI de main](https://github.com/IsGarciaMa/web-components-engineering-lab/actions/runs/41093648862) termina en fallo de E2E antes de PR-01. Sus pasos de instalación, tipos, tests, build e instalación de tres motores sí pasan. El log descargado muestra `scrollable-region-focusable` en código/tablas, selectores de búsqueda/tema que resuelven varios nodos y una aserción sobre todos los `details` en vez de la solución.

Se corrigen las causas dentro de las páginas y pruebas que necesita este capítulo: acceso por teclado estático, búsqueda por nombre accesible, selector de tema visible y solución acotada. No se desactivan reglas axe, aumentan reintentos ni elimina cobertura. La comprobación estática demuestra que los atributos se emiten; repetir axe real sigue siendo obligatorio.

**No existe una ejecución CI de esta rama:** no se ha publicado. El usuario confirma que no hay otro entorno compatible disponible. No se usa la CI de main como certificación del capítulo nuevo.

## Revisión P0–P3 y límites

- **P0:** ninguno identificado.
- **P1, validación pendiente:** falta ejecutar el capítulo en Chromium, Firefox y WebKit compatibles, revisar consola, estilos computados, responsive y capturas. Monterey impide instalar los motores; Docker no tiene daemon y no hay entorno alternativo. Ejecutar `pnpm check` en Ubuntu 24.04 tras preparar navegadores. Hasta entonces: NO-GO para aprobar merge.
- **P1 corregidos:** sintaxis MDX de un objeto sin escapar; import de registro explícito separado del import de tipos React; acceso de teclado a código y tablas; selectores ambiguos heredados. Se reprodujo también que retirar `heading` producía `null` y rompía el payload tipado: el accessor/conversor ahora normaliza valores ausentes o vacíos y una regresión verifica texto y evento válidos. Los fallos intermedios de configuración se resolvieron usando Sätteri y `ec.config.mjs`, sin introducir el procesador Markdown antiguo.
- **P2, tooling:** se conservan los nueve avisos descritos en [auditoría PR-00](security.md) y aparecen dos rutas moderadas de minimatch ([GHSA-g3hv-75wg-m249](https://github.com/advisories/GHSA-g3hv-75wg-m249)): patrones controlados por atacante y amplificación en preprocessing; aquí proceden de ESLint/typescript-eslint y configuración del repositorio. No están en el runtime de producción. Actualizar minimatch de forma compatible requiere revisar sus consumidores; no se fuerza un major con overrides. Se mantienen avisos de deprecación de ESLint y tres dependencias transitivas.
- **P2, rendimiento:** Mermaid mantiene chunks mayores de 500 kB. No se mide red ni Core Web Vitals en este entorno. El código fuente mostrado aumenta HTML de las páginas de estudio de forma deliberada; no se introduce caché o memoización sin medición.
- **P3:** avisos heredados de colección i18n vacía, colisión de la ruta 404 y sitemap sin dominio. El 404 generado conserva su contenido; no se inventa dominio ni se cambia hosting para silenciarlos.

La experiencia amplía tokens, paneles, navegación activa, mapas de lecciones y fuentes legibles. Se revisa por código el uso de propiedades lógicas, rejillas, áreas de controles, foco visible y medios adaptativos. **No hay capturas reales de PR-01, revisión visual en navegador, zoom manual ni lector de pantalla.** No se declara conformidad WCAG completa por preparación de tests o ausencia de errores de build.

## Preparación de entrega

Cambios locales en la rama solicitada, sin staging ni commit. Revisión material en [la descripción propuesta](pr-01-description.md). Una única PR para el capítulo. Antes de aprobarla hay que ejecutar E2E en sistema compatible, revisar capturas y resolver cualquier fallo demostrado. No se autoriza push, merge ni despliegue.
