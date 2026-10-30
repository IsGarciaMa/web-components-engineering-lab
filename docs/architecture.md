# Arquitectura de PR-00

Un único proyecto Astro estático integra Starlight para documentación, navegación, Pagefind y temas. La academia extiende la portada y la identidad mediante los overrides `Hero` y `SiteTitle`; conserva el shell documental de Starlight en las demás rutas.

## Dependencias entre módulos

```text
content/docs → components/portal, learning, labs, progress
learning → data/curriculum
progress → data/curriculum + Lit + localStorage
components/labs → CounterDemo + examples?raw + labs/counter-lab
CounterDemo → scripts del navegador → examples/native + examples/lit
examples/native + examples/lit → examples/shared
```

`src/data/curriculum.ts` contiene el índice editorial y los objetivos de once capítulos. Las páginas MDX mantienen sus URLs originales y componen `chapter-overview.astro`. Publicar la lección inicial no cambia el estado de ningún capítulo. La plantilla reúne objetivos, índice, documentación, ejemplos/laboratorios, ejercicios, presentaciones, referencias y siguiente contenido; distingue recursos iniciales disponibles de material futuro.

El contenido de la lección permanece en Markdown/MDX. El laboratorio es un consumidor independiente: registra `count-change`, valida el payload, conserva hasta ocho filas y limpia únicamente el registro. No altera el Shadow DOM de los ejemplos. Sus listeners se retiran al desconectar. Los archivos fuente se importan con `?raw` y se muestran escapados con `Code` público de Starlight, sin ejecutar entradas editables.

Los Custom Elements solo se importan en scripts de navegador, nunca en frontmatter SSR. `CounterDemo` registra las implementaciones y no les impone dependencias del portal. El contrato compartido conserva conversión, estilos constantes y emisión de eventos; las diferencias de rendering nativo/Lit son explícitas.

## Estado y persistencia

Cada contador mantiene su estado. `lab-learning-progress` usa Lit y estado local con persistencia optativa en `lab-learning-progress-v1`. No escribe hasta activar el progreso. El esquema versionado solo guarda un booleano para la lección inicial. Valida datos al leer y comunica fallos de lectura, guardado o borrado sin bloquear el contenido.

Se puede marcar o desmarcar la lección y borrar/desactivar el seguimiento. No hay autenticación, telemetría, sincronización entre dispositivos ni store global. Añadir lecciones publicadas requiere evolucionar ese contrato y su denominador explícitamente. No se contabilizan capítulos pendientes ni se certifica aprendizaje.

## Diseño y recursos

Tokens CSS propios definen superficies, texto, acentos, espaciados y bordes para ambos temas. El diseño usa tipografía del sistema sin peticiones externas, CSS Grid, propiedades lógicas, foco visible, controles nativos, reduced motion y forced colors. Starlight sigue gestionando el selector de tema, búsqueda y menú responsive. La validación visual efectiva está pendiente; revisar código no sustituye navegador.

Mermaid se carga solo donde se usa `Diagram.astro`, con fuentes revisadas y alternativa textual. Marp genera HTML en `public/slides` antes del build; se enlaza desde lección, capítulo, recursos y laboratorio. Las salidas y `dist` se ignoran en Git.

## Entrega

Los scripts requieren dependencias locales de la versión declarada. La CI prepara instalación congelada, comprobaciones y tres motores Playwright en Ubuntu. Vercel está configurado para salida estática `dist`, con despliegues Git desactivados. El lockfile y el build están validados localmente; E2E y ejecución remota de CI siguen pendientes por el entorno.

Decisiones: [ADR-0001](adr/0001-static-portal.md), [ADR-0002](adr/0002-toolchain-and-support.md), [ADR-0003](adr/0003-skills-contract.md) y [ADR-0004](adr/0004-learning-experience.md). Resultados reales en [validación](validation.md).
