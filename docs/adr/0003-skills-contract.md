# ADR-0003: contrato común y Skills específicas

Estado: aceptado; catálogo ampliado a once Skills, con reconocimiento de la nueva pendiente de actualización de sesión.

## Contexto

Las siguientes PR necesitan reglas comunes y procedimientos especializados sin cargar todas las instrucciones en cada tarea.

## Decisión

Mantener las normas generales en `AGENTS.md` y once Skills con frontmatter YAML `name` y `description`, más instrucciones Markdown. Sus descripciones delimitan la activación; los cuerpos aportan decisiones y comprobaciones específicas sin repetir el contrato completo. No crear recursos auxiliares vacíos.

La ruta instalada es `.agents/skills/<nombre>/SKILL.md`. Las diez entradas originales aparecen en el catálogo de esta sesión. Se incorpora `code-readability` en la misma ruta y se amplía el validador a once nombres; su reconocimiento automático se comprobará por separado. El directorio sigue protegido contra escritura; no existe un fallback `codex-skills/`.

## Consecuencias

El agente debe leer explícitamente las Skills aplicables antes de trabajar. Se mantiene una única fuente en la ruta de descubrimiento. La validación estructural no prueba la calidad del comportamiento y debe acompañarse de revisión de instrucciones y uso real.

## Ampliación de legibilidad

`code-readability` organiza el código por intención sin sustituir Prettier, ESLint ni TypeScript. Sus ejemplos detallados se conservan en un recurso enlazado, sin duplicar arquitectura, lifecycle ni procedimientos de code review.

Se activan `no-else-return` y `consistent-type-imports`, comprobadas sin incidencias en la base y con fixtures de TS/Astro/JS. Se conserva la configuración de Prettier y no se añaden plugins. La activación global de `curly` se aplaza porque supondría 91 correcciones en 32 archivos; las llaves se aplican al código nuevo y a bloques modificados mediante la Skill. No se añade padding core deprecado, un umbral de complejidad sin evidencia ni ordenación automática que ignore efectos de imports.

La adopción no autoriza refactorizaciones masivas. Validación estructural y reconocimiento en Codex siguen siendo comprobaciones distintas. Detalles, ejemplos y límites en [Skills](../skills.md).
