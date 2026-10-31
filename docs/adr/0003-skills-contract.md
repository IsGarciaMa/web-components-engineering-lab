# ADR-0003: contrato común y Skills específicas

Estado: aceptado; once Skills instaladas y reconocidas según el estado confirmado del proyecto.

## Contexto

Las siguientes PR necesitan reglas comunes y procedimientos especializados sin cargar todas las instrucciones en cada tarea.

## Decisión

Mantener las normas generales en `AGENTS.md` y once Skills con frontmatter YAML `name` y `description`, más instrucciones Markdown. Sus descripciones delimitan la activación; los cuerpos aportan decisiones y comprobaciones específicas sin repetir el contrato completo. No crear recursos auxiliares vacíos.

La ruta instalada es `.agents/skills/<nombre>/SKILL.md`. Las once Skills, incluida `code-readability`, están reconocidas según el estado confirmado. El validador comprueba los once nombres y su estructura; no certifica comportamiento. El directorio sigue protegido contra escritura; no existe un fallback `codex-skills/`.

## Consecuencias

El agente debe leer explícitamente las Skills aplicables antes de trabajar. Se mantiene una única fuente en la ruta de descubrimiento. La validación estructural no prueba la calidad del comportamiento y debe acompañarse de revisión de instrucciones y uso real.

## Ampliación de legibilidad

`code-readability` organiza el código por intención sin sustituir Prettier, ESLint ni TypeScript. Sus ejemplos detallados se conservan en un recurso enlazado, sin duplicar arquitectura, lifecycle ni procedimientos de code review.

Se activan `no-else-return` y `consistent-type-imports`, comprobadas sin incidencias en la base y con fixtures de TS/Astro/JS. Se conserva la configuración de Prettier y no se añaden plugins. La activación global de `curly` se aplaza porque supondría 91 correcciones en 32 archivos; las llaves se aplican al código nuevo y a bloques modificados mediante la Skill. No se añade padding core deprecado, un umbral de complejidad sin evidencia ni ordenación automática que ignore efectos de imports.

La adopción no autoriza refactorizaciones masivas. Validación estructural y reconocimiento en Codex siguen siendo comprobaciones distintas. Detalles, ejemplos y límites en [Skills](../skills.md).

## Validación proporcional

Las convenciones se aplican mientras se implementa, activando solo las Skills pertinentes y reutilizando contexto y comprobaciones vigentes. La revisión explícita se reserva al cierre de PR o a cambios críticos. No se generan informes por cada tarea ni se repiten bloqueos de entorno ya demostrados.

`check:fast` agrupa calidad rápida; `check:build` la incluye una vez y genera/valida producción; `check:e2e` conserva navegador en un entorno compatible; `check:full` combina ambos. `pnpm check` es alias de `check:build`. CI separa calidad y navegador reutilizando `dist`; conserva las puertas antes del merge sin obligar a ejecutarlas tras cada archivo. Monterey y la ausencia conocida de PyYAML no bloquean el trabajo independiente.
