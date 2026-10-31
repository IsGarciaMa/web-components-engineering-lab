# Skills de Codex del laboratorio

El catálogo del repositorio pasa de diez a **once Skills** con `code-readability`. Se mantiene una sola fuente en `.agents/skills/<nombre>/SKILL.md`, con frontmatter YAML `name` y `description`. No existe un directorio alternativo `codex-skills/` ni se duplican los cuerpos en `AGENTS.md`.

Las once Skills están instaladas, reconocidas y validadas según el estado confirmado del proyecto. La validación estructural sigue siendo distinta del reconocimiento en el cliente; no se repiten esas comprobaciones si su base no ha cambiado. La [code-readability](../.agents/skills/code-readability/SKILL.md) se aplica mientras se escribe, sin una auditoría adicional tras cada implementación.

```sh
pnpm skills:check
```

El validador exige los once nombres instalados, frontmatter y cuerpos. La cuenta de su salida se obtiene de la lista esperada. No demuestra calidad de las instrucciones, ejecución de ejemplos ni descubrimiento del cliente.

## code-readability

Activación: desarrollo de funcionalidades, correcciones, refactorizaciones, implementaciones TypeScript/Lit, generación de ejemplos educativos y revisión de PR. `AGENTS.md` contiene esta activación y mantiene las reglas comunes.

La Skill complementa responsabilidades existentes:

| Recurso               | Responsabilidad                                                                                    |
| --------------------- | -------------------------------------------------------------------------------------------------- |
| Prettier              | Indentación, comillas, punto y coma, ancho, comas finales y espaciado sintáctico                   |
| ESLint                | Patrones verificables de código, incluidos retornos y usos de tipos                                |
| TypeScript estricto   | Contratos estáticos, sin eliminar la necesidad de validar datos externos                           |
| code-readability      | Bloques de intención, nombres, flujo, handlers, clases, asincronía y templates legibles            |
| frontend-architecture | Límites de módulos y responsabilidades                                                             |
| lit-engineering       | Semántica reactiva, templates, lifecycle y recursos                                                |
| code-review           | Cierre de PR, arquitectura importante, seguridad crítica o petición expresa; hallazgos y evidencia |

No se modifican las opciones de Prettier. La separación visual se decide por intención y conserva juntas las operaciones relacionadas. Las llaves se exigen en los bloques nuevos o modificados. No se fuerza una línea vacía después de cada declaración ni se extraen helpers/controladores por sistema.

Los [ejemplos antes/después](../.agents/skills/code-readability/references/examples.md) cubren guard clauses, variables, transformaciones, booleanos ambiguos, imports con registro, asincronía, handlers, `render()`, lifecycle, CSS y tests. Se cargan desde el enlace de la Skill cuando hacen falta, sin repetirlos en el contrato general. Son fragmentos con contexto indicado; no se afirma que todos sean programas independientes ejecutados.

## Decisiones ESLint

Evaluación con las versiones instaladas: ESLint 9.39.5, typescript-eslint 8.72.0, eslint-plugin-astro 1.5.0 y Prettier 3.8.0. Se usó la configuración efectiva sobre el repositorio y fixtures de TS/Astro/JS; no se incorporan dependencias ni plugins nuevos.

| Regla                                        | Decisión y motivo                                                                                                                                                                                                                                                                                              |
| -------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `no-else-return`                             | Añadida como error con `allowElseIf: false`: favorece guards sin imponer formato. No había incidencias en el código existente.                                                                                                                                                                                 |
| `@typescript-eslint/consistent-type-imports` | Añadida como error en TS/TSX/Astro, con `prefer: 'type-imports'` y `fixStyle: 'inline-type-imports'`. Conserva la convención existente de imports mixtos; también permite `import type`. No había incidencias actuales.                                                                                        |
| `curly`                                      | Compatible y sin deprecación en ESLint instalado. Activación global aplazada: `all` detectó **91 incidencias en 32 archivos** antes del cambio. Imponerla ahora exigiría una migración masiva ajena a esta tarea. La Skill exige llaves para lo que se escriba o modifique y permite comprobación por archivo. |
| `padding-line-between-statements`            | Descartada la regla core: deprecada. No se añade un plugin solo para imponer espaciado, ni una regla indiscriminada después de toda declaración.                                                                                                                                                               |
| `complexity`                                 | No añadida: no se ha demostrado un problema ni justificado un umbral global. La revisión exige simplificar complejidad real sin fijar cuotas arbitrarias.                                                                                                                                                      |
| Orden automático de imports                  | No se incorpora un plugin. `sort-imports` core no expresa por sí solo agrupación por intención y puede exigir cambios de orden con efectos. Se conservan registro, polyfills y CSS en el orden requerido.                                                                                                      |

Las reglas nuevas usan el stack ya instalado y no reimplementan las opciones de Prettier. El autofix se prueba junto al formateador para detectar ciclos. Una regla de imports no garantiza que un módulo de registro siga ejecutándose: el consumidor debe conservar el import de efecto lateral si también importa su tipo.

La adopción es incremental: no se aplica `eslint --fix .` ni se reescriben las incidencias antiguas de llaves. No se añaden supresiones generales para presentar una migración como completada. Si el equipo decide activar `curly` globalmente, esa migración debe revisarse con su propio alcance y evidencia.

## Validación y límites

Las pruebas de tooling ejercitan detección y autofix sobre un consumidor TypeScript, comprueban estabilidad con Prettier y verifican que Astro/JavaScript conservan sus parsers y reglas aplicables. No se ejecutan fixtures de código con efectos externos.

La edición de `.agents` requiere elevación por los permisos de la sesión; prepara y formatea los cambios antes de escribirlos. Esta restricción de permisos no convierte cada uso de una Skill en una instalación o validación nueva.

`pnpm skills:check` es la comprobación estructural habitual cuando se modifican Skills o catálogo. No se instala ni reinvestiga PyYAML para repetir el fallo conocido del validador Python auxiliar; no es un bloqueo de desarrollo.

La política de riesgo vive en `AGENTS.md`: formato/pruebas afectadas para cambios pequeños, implementación completa con tests pertinentes para funcionalidades y una ejecución de `check:build` al cerrar PR. No se ejecutan por separado sus pasos ya incluidos sobre el mismo estado. Navegador, axe, responsive y consola se mantienen en CI compatible antes del merge; no se ejecuta Playwright localmente en Monterey. Una restricción conocida se reabre solo si cambia el entorno o aparece nueva evidencia.

Consulta únicamente las Skills aplicables. `frontend-architecture` guía los límites mientras implementas; `quality-engineering` elige pruebas relacionadas; `security-performance` profundiza ante riesgos o cambios pertinentes. `code-review` se reserva para cierre de PR, arquitectura importante, seguridad crítica o solicitud expresa. Mantén resultados y contexto vigentes, sin informes extensos ni microtareas de auditoría.

## Fuentes y decisión duradera

El [ADR-0003](adr/0003-skills-contract.md) recoge el catálogo y la adopción incremental. Referencias contrastadas con los metadatos del tooling instalado:

- [Prettier: líneas vacías y decisiones de formato](https://prettier.io/docs/rationale.html).
- [ESLint: curly](https://eslint.org/docs/latest/rules/curly), [no-else-return](https://eslint.org/docs/latest/rules/no-else-return) y [deprecación de padding](https://eslint.org/docs/latest/rules/padding-line-between-statements).
- [typescript-eslint: consistent-type-imports](https://typescript-eslint.io/rules/consistent-type-imports/).
