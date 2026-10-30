# Skills de Codex en PR-00

Revisión final del 30 de octubre de 2026: las diez Skills están instaladas en `.agents/skills/<nombre>/SKILL.md`. Todas aparecen, con su nombre, descripción y ruta, en el catálogo de Skills disponible en esta sesión de Codex. No existe `codex-skills/` ni una segunda fuente que trasladar. El estado anterior de instalación bloqueada ha quedado resuelto.

Se leyeron explícitamente los diez archivos para revisar arquitectura, APIs nativas, Lit, accesibilidad, calidad, seguridad, entorno, contenido, DevOps y code review. Sus procedimientos tienen activaciones específicas, contratos observables, comprobaciones y límites de evidencia; no añaden dependencias ni requieren recursos auxiliares vacíos. Las correcciones de integración y la distinción entre pruebas ejecutadas y pendientes aplican esos procedimientos.

```sh
pnpm skills:check
```

Resultado: diez Skills válidas estructuralmente. Este comando comprueba nombres, directorios, frontmatter y cuerpos; no demuestra por sí solo descubrimiento ni calidad de ejecución. El reconocimiento indicado arriba procede del catálogo de esta sesión, no del validador.

En otra sesión, confirma los diez nombres y rutas con el selector de Skills de Codex. `.agents` permanece protegida contra escritura en este entorno; no se modificaron los cuerpos durante la revisión final.
