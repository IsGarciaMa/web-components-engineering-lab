---
name: code-readability
description: 'Escribe y revisa TypeScript, Lit y ejemplos del laboratorio con bloques lógicos, nombres expresivos y flujo legible; úsala en funcionalidades, correcciones, refactorizaciones y revisión de PR.'
---

# code-readability

Mejora la comprensión del código que exige la tarea. Antes de editar, lee `AGENTS.md`, `prettier.config.mjs`, `eslint.config.mjs`, los tsconfig aplicables y el código cercano. Conserva contratos, orden de efectos y comportamiento; separa cualquier corrección funcional de una reorganización visual en la explicación y sus pruebas.

## Responsabilidades y alcance

- Prettier decide indentación, comillas, punto y coma, ancho de línea, comas finales, espaciado sintáctico y formato de TS/Astro/templates. No lo contradigas con alineaciones manuales, reglas de formato equivalentes ni `prettier-ignore` para imponer preferencias.
- ESLint detecta patrones concretos; TypeScript comprueba contratos estáticos. Ninguno decide por sí solo dónde cambia la intención de un algoritmo.
- Usa `frontend-architecture` para límites de módulos; `lit-engineering` para semántica reactiva y lifecycle; `code-review` para priorización y evidencia. Esta Skill aporta organización local y claridad, sin repetir sus procedimientos.
- Aplica las convenciones a código nuevo y a los bloques que necesitas modificar. No ejecutes un autofix global, reformatees el repositorio ni reorganices archivos ajenos para introducir la Skill. No crees helpers o capas por una cuota de tamaño.

## Bloques, imports y control de flujo

Agrupa declaraciones que preparan una misma operación. Inserta **una línea vacía al cambiar de intención**: preparar datos, validar, transformar, ejecutar un efecto o devolver un resultado. No fuerces una separación si esas operaciones forman una unidad corta; tampoco insertes una línea después de toda declaración ni entre cada paso de una cadena sencilla.

Separa métodos, unidades independientes de control y fases de un `try/catch`. Mantén próximos un getter y su setter, o campos que describan un mismo estado. En CSS separa grupos de selectores por su función; Prettier sigue formateando las declaraciones.

Usa llaves en `if`, `else`, `for`, `while`, `do` y estructuras equivalentes que escribas o modifiques, aunque tengan una sola instrucción. Prefiere guard clauses cuando eliminen niveles innecesarios sin ocultar una alternativa importante. Evita ternarios anidados; un ternario simple para un valor o una rama corta de template es válido.

Nombra condiciones compuestas si el nombre explica una decisión de dominio o evita repetirla. No transformes una condición evidente en una colección de variables sin significado adicional. Conserva orden de evaluación y cortocircuitos cuando tengan efectos.

Organiza imports en grupos comprensibles: bibliotecas, módulos del proyecto y efectos laterales cuando su orden lo permita. Separa `import type` o usa especificadores `type` en imports mixtos. **No reordenes imports de registro, polyfills o CSS sin revisar sus efectos.** Si una clase solo se usa como tipo pero su módulo registra un Custom Element, conserva un import de efecto lateral explícito.

## Funciones, clases y asincronía

- Expresa una responsabilidad reconocible mediante el nombre. Sustituye parámetros booleanos ambiguos por una operación explícita o un objeto de opciones cuando aclare la llamada; no cambies APIs públicas por preferencia estética.
- Extrae un callback extenso si mezcla validación, transformación y efectos, o si un nombre describe mejor la operación. Conserva inline los callbacks breves y claros. Divide cadenas difíciles por etapas de dominio; no dividas `filter().map()` por sistema.
- Agrupa estado, API pública y comportamiento interno con un orden consistente con la clase cercana. Separa métodos; mantén constructores pequeños y limita su trabajo al permitido por la clase base. No muevas efectos de conexión al constructor para reducir líneas.
- Prefiere composición cuando resuelva responsabilidades distintas; no introduzcas una jerarquía para compartir dos funciones pequeñas.
- En operaciones asíncronas distingue entradas, ejecución y tratamiento del resultado. Prefiere `async/await` si aclara una cadena de promesas; una promesa directa o una cadena breve también es válida.
- Usa `try/catch` donde puedas recuperar, comunicar o añadir contexto conservando la causa. No añadas un catch vacío ni devuelvas un valor de éxito tras un fallo. No elimines un fallback documentado como si fuese un error oculto.
- Mantén tipos explícitos en contratos públicos y resultados cuyo significado no sea evidente. Deja inferir variables locales seguras. No dupliques interfaces ni añadas `any`, `!` o casts para evitar un guard real.

## Lit y Web Components

Conserva `render()` puro: derivación sencilla y composición de templates, sin peticiones, listeners manuales, escrituras de estado o mutaciones DOM. Evita interpolaciones que combinen varias decisiones y efectos. Extrae un getter, un método de render o un handler solo si nombra una responsabilidad real.

Agrupa propiedades reactivas por contrato y estado interno. Mantén decorators y campos compatibles con el tsconfig existente. El accessor reactivo ya solicita actualizaciones; no añadas `requestUpdate()` para hacer visible una refactorización.

Conserva legibles los bindings de atributo, `.property`, `?boolean` y `@event`. Mueve handlers extensos a métodos sin perder su contexto `this`. Usa directivas por semántica o necesidad observable, no para acortar cualquier template.

En lifecycle conserva `super` cuando lo requiera la base, conexión repetible y limpieza correspondiente. Usa funciones estables al retirar listeners externos. No introduzcas efectos en `updated()` ni helpers/controllers sin un comportamiento reutilizable que lo justifique. No manipules nodos gestionados por Lit para simplificar un template.

## Reglas automatizadas y adopción incremental

Consulta `docs/skills.md` para el estado de las reglas, no infieras que toda convención está automatizada:

- Activas: `no-else-return` y `@typescript-eslint/consistent-type-imports` en los archivos correspondientes. No duplican el formato de Prettier.
- `curly: ['error', 'all']` es compatible, pero su activación global está aplazada para evitar una migración masiva. Las llaves siguen siendo obligatorias al escribir o modificar un bloque. Puedes comprobar archivos concretos con `pnpm exec eslint <archivos> --rule 'curly: [error, all]'`; distingue incumplimientos heredados fuera del cambio y no los silencies con disables generales.
- No activar `padding-line-between-statements` core deprecada ni añadir un plugin solo para exigir líneas vacías. La separación responde a intención, no a cada declaración.
- No imponer un umbral de `complexity` sin evidencia y un presupuesto razonado. No añadir un ordenador de imports que cambie efectos laterales sin comprobarlo.

## Ejemplos y verificación

Consulta [antes y después](references/examples.md) al generar ejemplos o revisar una reorganización: incluye guard clauses, agrupación, transformaciones, asincronía, handlers, Lit, lifecycle, imports, CSS y tests. Son alternativas con el contexto indicado, no instrucciones para reescribir esos módulos del proyecto.

Revisa el diff buscando cambios de comportamiento, efectos reordenados y abstracciones innecesarias. Comprueba que los tests mantienen preparación, acción y observación claras; espera el ciclo real de Lit en lugar de esperas fijas y conserva las aserciones del contrato público.

Ejecuta Prettier, ESLint, tipos y pruebas afectadas; build si cambian configuración, imports, Astro o ejemplos publicados. Si modificas esta Skill o su catálogo, ejecuta `pnpm skills:check`. Respeta las puertas de entrega de `AGENTS.md` y comunica cada comprobación bloqueada. Leer un fichero o validar su estructura no demuestra reconocimiento automático en Codex ni ejecución de los ejemplos.
