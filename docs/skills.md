# Skills de Codex del laboratorio

El catálogo del repositorio pasa de diez a **once Skills** con `code-readability`. Se mantiene una sola fuente en `.agents/skills/<nombre>/SKILL.md`, con frontmatter YAML `name` y `description`. No existe un directorio alternativo `codex-skills/` ni se duplican los cuerpos en `AGENTS.md`.

Las diez originales estaban reconocidas en el catálogo de esta sesión. La nueva [code-readability](../.agents/skills/code-readability/SKILL.md) se lee explícitamente durante esta entrega. Su descubrimiento automático debe comprobarse cuando Codex actualice el catálogo de una sesión; crear el archivo y pasar el validador no acreditan ese reconocimiento.

```sh
pnpm skills:check
```

El validador exige los once nombres instalados, frontmatter y cuerpos. La cuenta de su salida se obtiene de la lista esperada. No demuestra calidad de las instrucciones, ejecución de ejemplos ni descubrimiento del cliente.

## code-readability

Activación: desarrollo de funcionalidades, correcciones, refactorizaciones, implementaciones TypeScript/Lit, generación de ejemplos educativos y revisión de PR. `AGENTS.md` contiene esta activación y mantiene las reglas comunes.

La Skill complementa responsabilidades existentes:

| Recurso               | Responsabilidad                                                                         |
| --------------------- | --------------------------------------------------------------------------------------- |
| Prettier              | Indentación, comillas, punto y coma, ancho, comas finales y espaciado sintáctico        |
| ESLint                | Patrones verificables de código, incluidos retornos y usos de tipos                     |
| TypeScript estricto   | Contratos estáticos, sin eliminar la necesidad de validar datos externos                |
| code-readability      | Bloques de intención, nombres, flujo, handlers, clases, asincronía y templates legibles |
| frontend-architecture | Límites de módulos y responsabilidades                                                  |
| lit-engineering       | Semántica reactiva, templates, lifecycle y recursos                                     |
| code-review           | Hallazgos, prioridades y evidencia                                                      |

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

La instalación en `.agents` requiere elevación por los permisos de la sesión. El borrador se prepara y formatea antes de solicitar esa escritura. La política del entorno, no la Skill, impone ese permiso.

`quick_validate.py` de skill-creator necesita PyYAML; el Python inicial no lo tiene. La ejecución inicial falla con `ModuleNotFoundError: yaml`. Se distingue esta limitación del resultado de `pnpm skills:check`, que no depende de Python. El estado final de comprobaciones está al final de esta página.

Para una entrega completa, `AGENTS.md` sigue exigiendo instalación congelada y `pnpm check`. Los navegadores de Playwright no son instalables en el Monterey actual; ninguna prueba de navegador se presenta como aprobada por esta Skill.

## Fuentes y decisión duradera

El [ADR-0003](adr/0003-skills-contract.md) recoge el catálogo y la adopción incremental. Referencias contrastadas con los metadatos del tooling instalado:

- [Prettier: líneas vacías y decisiones de formato](https://prettier.io/docs/rationale.html).
- [ESLint: curly](https://eslint.org/docs/latest/rules/curly), [no-else-return](https://eslint.org/docs/latest/rules/no-else-return) y [deprecación de padding](https://eslint.org/docs/latest/rules/padding-line-between-statements).
- [typescript-eslint: consistent-type-imports](https://typescript-eslint.io/rules/consistent-type-imports/).

## Resultado de esta entrega

Comprobación del 31 de octubre de 2026:

| Comando o comprobación                                                     | Resultado observado                                                                                                            |
| -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `pnpm install --frozen-lockfile`                                           | Pasa; sin cambios en dependencias ni lockfile                                                                                  |
| `pnpm skills:check`                                                        | Once Skills válidas estructuralmente                                                                                           |
| Prettier explícito sobre los dos archivos instalados y `pnpm format:check` | Pasan; se usa la configuración real del repositorio                                                                            |
| `pnpm lint`                                                                | Pasa con las dos reglas nuevas; sin refactorizar la aplicación                                                                 |
| `pnpm typecheck`                                                           | Pasa: 49 archivos Astro sin errores/avisos/hints y tsc con salida 0                                                            |
| `pnpm test:tooling`                                                        | Cinco pruebas pasadas, incluidas las dos nuevas de compatibilidad/autofix                                                      |
| `pnpm test`                                                                | 47 pruebas pasadas en nueve archivos                                                                                           |
| `pnpm build` y `pnpm docs:check`                                           | Pasan: Marp, 40 rutas, Pagefind, 43 HTML y 2.129 referencias locales/fragmentos                                                |
| `pnpm check`                                                               | Salida 1 en E2E: 126 fallos al lanzar ejecutables ausentes; ningún cuerpo valida la interfaz. Las puertas anteriores pasan     |
| `git diff --check`                                                         | Pasa por separado; la última instrucción del check no se alcanza tras el fallo E2E                                             |
| YAML y recurso enlazado                                                    | Frontmatter analizado con js-yaml ya instalado y referencia a examples.md existente. No sustituye el validador Python auxiliar |

El intento de `quick_validate.py` no llega a validar por falta de PyYAML; no se instala una dependencia global para ocultarlo. La nueva Skill queda instalada y leída explícitamente, con descubrimiento automático pendiente de actualización del catálogo. Los ejemplos se revisan como fragmentos con contexto, no como programas independientes ejecutados. No se hace commit, push ni merge.
