# feat(chapter-01): teach using web components with interactive labs

## Problema y resultado

PR-00 dejaba el primer capítulo como planificación. PR-01 publica Using Web Components con siete lecciones originales, ocho laboratorios con código ejecutado por la página, tres ejercicios con soluciones voluntarias, tres diagramas y una presentación Marp.

El estudiante puede consumir Web Awesome desde npm, experimentar con tokens/partes/registro, inspeccionar propiedades y eventos e integrar el mismo contrato con React 19.3.1 y Astro. El ejemplo de renderizado conserva contenido útil sin JavaScript; se distingue expresamente de SSR de Lit. Angular/Vue se documentan como recetas, sin aplicaciones adicionales.

La navegación marca el capítulo disponible y mantiene diez pendientes; la URL inicial de PR-00 redirige. El progreso v2 conserva datos anteriores y cuenta las siete lecciones nuevas.

## Arquitectura

[ADR-0005](adr/0005-using-web-components.md): ejemplos independientes, consumidores separados, estructura Astro compartida, scripts específicos por demo y propiedad explícita del DOM. Web Awesome/React se añaden por requisitos de integración; Sätteri ya existente se declara directamente para configurar el acceso de teclado de tablas. Sin SSR adicional ni editor arbitrario.

## Evidencia y límites

[Informe de validación](pr-01-validation.md): instalación congelada, lint, tipos, 47 tests rápidos, build/Marp/Pagefind y referencias locales. La CI heredada de main falla en E2E; se corrigen regiones con scroll y selectores ambiguos sin retirar axe.

**E2E: 126 casos fallan al lanzar navegadores ausentes; capturas y validación de interfaz pendientes de sistema compatible.** Monterey rechaza los motores de Playwright y no hay otro entorno disponible. Auditoría de producción sin avisos; la completa conserva avisos de tooling documentados. No se presenta esta descripción como aprobación de merge ni como resultado de CI de esta rama.
