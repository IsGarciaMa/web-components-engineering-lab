# Web Components Engineering Lab

Academia open source en español para entender Web Components, Lit y las APIs del navegador. PR-00 incorpora una experiencia educativa inicial; los once capítulos conservan su orden y estado pendiente.

## Recorrer la academia

- `/`: identidad visual propia, introducción y metodología.
- `/ruta/`: once capítulos con objetivos y estado editorial, y progreso local opcional.
- `/capitulos/01-plataforma-web/` y siguientes: plantilla común con planificación y recursos de orientación.
- `/guias/contador/`: lección inicial disponible, contrato nativo/Lit y autoevaluación.
- `/laboratorios/contador/`: contadores funcionales, código fuente y registro de eventos.
- `/ejercicios/contador/`: práctica local, criterios de aceptación y solución razonada.
- `/guias/recursos/`: Mermaid y presentación Marp.

No se han desarrollado los capítulos de PR-01 a PR-11. El progreso solo cuenta la lección publicada, se activa voluntariamente y permanece en este navegador.

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

Antes de entregar, instala los navegadores en un sistema soportado y ejecuta todas las puertas:

```sh
pnpm exec playwright install --with-deps chromium firefox webkit
pnpm check
```

Los scripts exigen las herramientas locales y sus versiones exactas. `pnpm check` incluye Skills, Prettier, ESLint, tipos, tooling, Vitest, Marp, Astro, Playwright y diff. Los E2E generan capturas en `test-results/`, además de comprobar navegación, eventos, progreso, búsqueda, temas, accesibilidad automatizada y reflow.

## Arquitectura

Astro/Starlight conserva documentación, búsqueda, navegación y temas. Los componentes Astro componen el portal; Lit gestiona la pequeña interfaz de progreso. Los ejemplos nativos y Lit siguen independientes del portal. El laboratorio consume sus eventos y muestra los archivos reales mediante imports `?raw`. No se añaden dependencias.

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

PR-00 sigue en **NO-GO para el primer commit** mientras falte la validación en navegador compatible. La instalación congelada, también limpia desde el store local, las diez Skills reconocidas, los tipos, las 28 pruebas Vitest, las 3 de tooling y el build están comprobados. Playwright 1.64.1 no admite macOS 12: consola, responsive, axe y capturas quedan pendientes. La auditoría de producción devuelve cero avisos; la completa registra nueve en tooling, con alcance documentado en [seguridad](docs/security.md).

Consulta [validación y límites](docs/validation.md), [Git y entorno](docs/environment.md), [estado de las Skills](docs/skills.md), [arquitectura](docs/architecture.md) y [Vercel](docs/deployment.md). No hay URL de repositorio configurada: la interfaz no publica un enlace ficticio a GitHub. No se ha hecho commit, push, merge ni despliegue.

Licencia [MIT](LICENSE).
