# Web Components Engineering Lab

Academia open source en español para entender Web Components, Lit y las APIs del navegador. Los capítulos **Using Web Components** y **Defining Web Components** incorporan siete y nueve lecciones completas; los otros nueve capítulos conservan su estado pendiente.

## Recorrer la academia

- `/`: identidad visual propia, introducción y metodología.
- `/ruta/`: once capítulos con objetivos y estado editorial, y progreso local opcional.
- `/capitulos/01-using-web-components/`: mapa de siete lecciones, navegación, progreso y recursos. La URL anterior redirige aquí.
- `/laboratorios/using-web-components/`: ocho demos con código real.
- `/ejercicios/using-web-components/`: tres niveles con soluciones voluntarias.
- `/slides/using-web-components.html`: presentación del capítulo.
- Capítulos 02–11: planificación futura.
- `/guias/contador/`: lección inicial disponible, contrato nativo/Lit y autoevaluación.
- `/laboratorios/contador/`: contadores funcionales, código fuente y registro de eventos.
- `/ejercicios/contador/`: práctica local, criterios de aceptación y solución razonada.
- `/guias/recursos/`: Mermaid y presentación Marp.

El progreso cuenta la lección inicial, las siete de PR-01 y las nueve de PR-02, se activa voluntariamente y permanece en este navegador. Lee los datos de PR-00 sin perder su avance. No se ha iniciado PR-03.

## Ejecutar

Node y pnpm están fijados en `.node-version` y `package.json`. Instala las versiones del lockfile versionado:

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Conserva el lockfile; actualízalo mediante pnpm cuando cambien dependencias. Para probar el resultado de producción y Pagefind:

```sh
pnpm build
pnpm preview
```

Durante el desarrollo usa pruebas relacionadas con el cambio. Los niveles agregados reutilizan los scripts existentes:

| Comando                           | Alcance                                                        |
| --------------------------------- | -------------------------------------------------------------- |
| `pnpm check:fast`                 | Prettier, ESLint, tipos, tooling y Vitest                      |
| `pnpm check:build` o `pnpm check` | Rápidas una vez, build con Marp/Pagefind y referencias locales |
| `pnpm check:e2e`                  | Playwright sobre un build vigente; solo en entorno compatible  |
| `pnpm check:full`                 | Integración y navegador; solo en entorno compatible            |

Al cerrar el capítulo ejecuta `check:build` una vez, sin repetir antes `check:fast`. Los cambios pequeños solo necesitan formato y pruebas relacionadas. `pnpm skills:check` se usa cuando cambian Skills o su catálogo, y siempre en CI.

La CI separa calidad y navegador en Ubuntu 24.04. El job de navegador descarga el `dist` validado por calidad, instala los tres motores y ejecuta E2E sin repetir build. Conserva navegación, eventos, progreso, búsqueda, temas, accesibilidad, reflow y consola; sube reportes ante fallos y las capturas de referencia explícitas también al pasar.

En un entorno compatible puedes filtrar, por ejemplo `pnpm check:e2e --project=chromium --grep "progreso"`. Monterey conserva su bloqueo conocido: no instales ni ejecutes los motores allí. No hace falta repetir ese diagnóstico ni instalar PyYAML para el validador auxiliar.

Los scripts siguen exigiendo herramientas locales de las versiones fijadas. Las políticas de selección de pruebas y problemas conocidos viven en `AGENTS.md`; no se genera un informe de auditoría por cada tarea.

## Arquitectura

Astro/Starlight conserva documentación, búsqueda, navegación y temas. Los componentes Astro componen el portal; Lit gestiona el progreso y los controles de los laboratorios. Los ejemplos nativos y Lit siguen independientes del portal. El laboratorio consume sus eventos y muestra los archivos reales mediante imports `?raw`. PR-01 añade Web Awesome y React para consumo e integración reales, con versiones fijadas; el [ADR-0005](docs/adr/0005-using-web-components.md) documenta el alcance.

```text
src/data/                  Índice editorial y lección disponible
src/content/docs/          Landing, ruta, capítulos, lección, laboratorio y ejercicio
src/components/portal/     Identidad y composición visual de la academia
src/components/learning/   Ruta y plantilla reutilizable de capítulo
src/components/labs/       Vista funcional y código del laboratorio
src/components/progress/   Opt-in, persistencia local y borrado
src/labs/                  Consumidor de eventos del laboratorio
src/examples/              Implementaciones native/lit y contrato shared
presentations/, diagrams/  Marp y Mermaid
exercises/                 Enunciados y soluciones del repositorio
tests/                     Unitarias, tooling y E2E
docs/adr/                  Decisiones duraderas
```

## Estado de entrega

PR-00 y PR-01 están integradas en main. PR-02 se desarrolla en `feat/02-defining-web-components`: nueve lecciones, ocho laboratorios, nueve diagramas, tres ejercicios con soluciones opcionales y una presentación. No se realiza commit, push, merge ni despliegue sin autorización.

- `/capitulos/02-defining-web-components/`: mapa y navegación de las nueve lecciones. La antigua URL del capítulo 02 redirige aquí.
- `/laboratorios/defining-web-components/`: registro, Shadow DOM, slots, plantillas, lifecycle, atributos, nativo/Lit y debugging.
- `/ejercicios/defining-web-components/`: contratos, composición y recursos.
- `/slides/defining-web-components.html`: presentación generada por Marp.

El [documento de arquitectura](docs/architecture.md) explica la propiedad de los nodos y la integración. El código fuente del capítulo vive en `src/examples/defining` y `src/labs/defining`; sus pruebas unitarias y E2E acompañan esos contratos.

Monterey mantiene su restricción conocida. Las pruebas E2E, accesibilidad de navegador y capturas preparadas no se consideran aprobadas hasta ejecutarse en CI compatible. No se repiten instalaciones de navegadores ni diagnósticos del mismo bloqueo. Los informes de PR-00/PR-01 son evidencia histórica de esas entregas.
