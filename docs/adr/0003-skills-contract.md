# ADR-0003: contrato común y Skills específicas

Estado: aceptado; diez Skills instaladas y reconocidas en la revisión final.

## Contexto

Las siguientes PR necesitan reglas comunes y procedimientos especializados sin cargar todas las instrucciones en cada tarea.

## Decisión

Mantener las normas generales en `AGENTS.md` y diez Skills con frontmatter YAML `name` y `description`, más instrucciones Markdown. Sus descripciones delimitan la activación; los cuerpos aportan decisiones y comprobaciones específicas sin repetir el contrato completo. No crear recursos auxiliares vacíos.

La ruta instalada es `.agents/skills/<nombre>/SKILL.md`. Las diez entradas aparecen en el catálogo de esta sesión de Codex y pasan `pnpm skills:check`. El directorio sigue protegido contra escritura; no existe un fallback `codex-skills/`.

## Consecuencias

El agente debe leer explícitamente las Skills aplicables antes de trabajar. Se mantiene una única fuente en la ruta de descubrimiento. La validación estructural no prueba la calidad del comportamiento y debe acompañarse de revisión de instrucciones y uso real.
